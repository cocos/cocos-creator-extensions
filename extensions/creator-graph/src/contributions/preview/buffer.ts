import { gfx, renderer } from 'cc';

declare const cc: any;
declare const cce: any;
declare const isSceneNative: boolean;
// @ts-ignore
module.paths.push(AppModulePath);

export interface IWindowInfo {
    index: number;
    uuid: string;
    name: string;
    window?: any;
}

export class PreviewBuffer {
    private _name: string;
    device = cc.director.root.device;
    width = Math.floor(cc.director.root.mainWindow.width);
    height = Math.floor(cc.director.root.mainWindow.height);
    data = new Uint8Array(this.width * this.height * 4);
    renderScene: any = null;
    scene: any = null;
    windows: any = {};
    window = null;
    // windowList: IWindowInfo[] = [];
    regions = [new gfx.BufferTextureCopy()];
    renderData: any;
    queue: any[];
    lock = false;
    _registerName?: string;
    constructor(registerName: string, name: string, scene: any = null) {
        this.renderData = {
            width: this.width,
            height: this.height,
            buffer: this.data,
        };
        this._name = name;
        this._registerName = registerName;
        this.onLoadScene(scene);
        this.regions[0].texExtent.width = this.width;
        this.regions[0].texExtent.height = this.height;
        this.createWindow();
        this.queue = [];
    }

    public resize(width: number, height: number, window: any = null) {
        window || (window = this.window);
        // only resize when window is render window
        if (!window) return;
        width = Math.floor(width);
        height = Math.floor(height);
        this.renderData.width = this.width = width;
        this.renderData.height = this.height = height;
        this.regions[0].texExtent.width = width;
        this.regions[0].texExtent.height = height;
        window.resize(width, height);
        this.renderData.buffer = this.data = new Uint8Array(this.width * this.height * 4);
    }
    /**
     * WARNING: DO'NOT USE IT BEFORE DRAW!!!
     */
    public clear() {
        // hack: resize width and height with 0 will be clear buff,realtime clear all data
        if (!isSceneNative) {
            this.resize(0, 0, this.window); // 原生场景会报错
        }
        this.resize(this.width, this.height, this.window);
    }

    createWindow(uuid: string | null = null) {
        if (uuid && this.windows[uuid]) {
            this.window = this.windows[uuid];
            return;
        }
        const root = cc.director.root;
        const renderPassInfo = new gfx.RenderPassInfo(
            [new gfx.ColorAttachment(root.mainWindow.swapchain.colorTexture.format)],
            new gfx.DepthStencilAttachment(root.mainWindow.swapchain.depthStencilTexture.format),
        );
        renderPassInfo.colorAttachments[0].barrier = root.device.getGeneralBarrier(new gfx.GeneralBarrierInfo(0, gfx.AccessFlagBit.FRAGMENT_SHADER_READ_TEXTURE));
        const window = root.createWindow({
            title: this._name,
            width: this.width,
            height: this.height,
            renderPassInfo,
            isOffscreen: true,
        });
        this.window = window;
        uuid && (this.windows[uuid] = window);
    }

    removeWindow(uuid: string) {
        if (uuid && this.windows[uuid]) {
            cc.director.root.destroyWindow(this.windows[uuid]);
            if (this.windows[uuid] === this.window) this.window = null;
            delete this.windows[uuid];
        }
    }

    onLoadScene(scene: any) {
        this.windows = {};
        this.scene = scene;
        this.renderScene = scene.renderScene;

    }

    switchCameras(camera: any, currWindow: any) {
        if (currWindow) {
            camera.isWindowSize = false;
            camera.isEnable = true;
            camera.changeTargetWindow(currWindow);
            cc.director.root.tempWindow = currWindow;
        }
    }

    public needInvertGFXApi = [
        gfx.API.GLES2,
        gfx.API.GLES3,
        gfx.API.WEBGL,
        gfx.API.WEBGL2,
    ];

    copyFrameBuffer(window: any = null) {
        window || (window = this.window);
        if (!window || !window.framebuffer) return this.renderData;
        this.device.copyTextureToBuffers(
            window.framebuffer.colorTextures[0],
            [new Uint8Array(this.renderData.buffer.buffer)],
            this.regions
        );

        this.formatBuffer(
            this.renderData.buffer,
            !this.needInvertGFXApi.includes(this.device.gfxAPI),
            this.device.gfxAPI === gfx.API.METAL
        );

        return this.renderData;
    }

    static indexOfRGBA = [0, 1, 2, 3];// r=>0 g=>1 b=>2 a=>3
    static indexOfBGRA = [2, 1, 0, 3];// r=>2 g=>1 b=>0 a=>3
    formatBuffer(buffer: Uint8Array, needInvert: boolean, conversionBGRA: boolean) {
        if (!needInvert) return buffer;

        let startIndex, invertIndex;
        const V_U_Vec4 = { r: 0, g: 0, b: 0, a: 0 };

        const indexArr = conversionBGRA ? PreviewBuffer.indexOfBGRA : PreviewBuffer.indexOfRGBA;

        for (let w = 0; w < this.renderData.width; w++) {
            for (let h = 0; h <= this.renderData.height / 2; h++) {

                startIndex = (h * this.renderData.width + w) * 4;
                // invert index
                invertIndex = ((this.renderData.height - h) * this.renderData.width + w) * 4;

                // flip Y
                V_U_Vec4.r = buffer[startIndex + indexArr[0]];
                V_U_Vec4.g = buffer[startIndex + indexArr[1]];
                V_U_Vec4.b = buffer[startIndex + indexArr[2]];
                V_U_Vec4.a = buffer[startIndex + indexArr[3]];

                buffer[startIndex + 0] = buffer[invertIndex + indexArr[0]];
                buffer[startIndex + 1] = buffer[invertIndex + indexArr[1]];
                buffer[startIndex + 2] = buffer[invertIndex + indexArr[2]];
                buffer[startIndex + 3] = buffer[invertIndex + indexArr[3]];

                buffer[invertIndex + 0] = V_U_Vec4.r;
                buffer[invertIndex + 1] = V_U_Vec4.g;
                buffer[invertIndex + 2] = V_U_Vec4.b;
                buffer[invertIndex + 3] = V_U_Vec4.a;

            }
        }

        return buffer;
    }

    getImageDataInQueue(width: number, height: number, event: any) {
        const params = {
            width: Math.floor(width),
            height: Math.floor(height),
        };
        this.queue.push({
            params,
            event,
        });
        this.step();
    }

    async step() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        const item = this.queue.shift();
        if (!item) {
            this.lock = false;
            return;
        }
        const { params, event } = item;
        const data = await this.getImageData(params.width, params.height);
        event.reply(null, data);
        this.lock = false;
        this.step();
    }

    async getImageData(width: number, height: number) {
        if (!this.renderScene) {
            return this.renderData;
        }
        cce.Engine.repaintInEditMode();

        const root = this.renderScene.root;
        const currWindow = this.window;
        if (!currWindow) {
            return this.renderData;
        }

        let curWindowCamera: renderer.scene.Camera | null | undefined = null;
        if (root) {
            for (const window of root.windows) {
                if (window.cameras.length > 0 && window === currWindow) {
                    // 对于preview可以认为一个window对应一个view
                    curWindowCamera = window.cameras[0];
                }
            }
        }

        if (!curWindowCamera) {
            return this.renderData;
        }

        const needResize = width && height && (width !== this.width || height !== this.height);
        if (needResize) {
            this.resize(width, height, currWindow);
        }

        if (curWindowCamera.width !== this.width || curWindowCamera.height !== this.height) {
            curWindowCamera.resize(width, height);
        }

        curWindowCamera.update(true);

        // 取一帧渲染完的数据
        return await new Promise((resolve) => {
            cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
                resolve(this.copyFrameBuffer(this.window));
            });
        });
    }
}
