import { Camera, Color, geometry, isValid, Node, Quat, renderer, Scene, Vec3, EventMouse } from 'cc';
import { PreviewBuffer } from './buffer';
import { PreviewBase } from './preview-base';
declare const cce: any;
declare const cc: any;
const tempVec3A = new Vec3();
const tempVec3B = new Vec3();

function clamp(val: number, min: number, max: number) {
    return val < min ? min : val > max ? max : val;
}

function makeVec3InRange(inVec3: Vec3, min: number, max: number) {
    inVec3.x = clamp(inVec3.x, min, max);
    inVec3.y = clamp(inVec3.y, min, max);
    inVec3.z = clamp(inVec3.z, min, max);

    return inVec3;
}

/**
 * 可交互的Preview窗口基类，可以在窗口中方便的预览场景中的元素
 */
class InteractivePreview extends PreviewBase {
    protected scene!: Scene;
    protected cameraComp!: Camera;
    protected camera: renderer.scene.Camera | any;
    protected isMouseDown = false;
    protected viewDist = 10;
    protected orbitRotateSpeed = 0.01;
    protected curCameraRot = new Quat();
    protected viewCenter = new Vec3();
    protected node: Node | null = new Node();

    protected isMouseLeft = false;

    private _flipWheelDirection = true;
    private _curPos = cc.v3();
    private _curRot = new Quat();
    private _forward = cc.v3(Vec3.UNIT_Z);
    private _v3a = cc.v3();

    constructor() {
        super();
        this.scene = new Scene('');
        this.cameraComp = new Node().addComponent(Camera);
        // @ts-ignore
        this.cameraComp.node.parent = this.scene;
        this.cameraComp.node.setPosition(0, 1, 2.5);
        this.cameraComp.node.lookAt(Vec3.ZERO);
        this.cameraComp.near = 0.01;
        this.cameraComp.enabled = false;

        this.createNodes();

        // @ts-ignore
        this.scene._load(); // ensure scene initialized
        // @ts-ignore
        this.scene._activate();
        this.cameraComp.clearColor = new Color(71, 71, 71, 255);
        this.camera = this.cameraComp.camera;
        this.camera.isWindowSize = false;
        this.camera.cameraUsage = renderer.scene.CameraUsage?.EDITOR;
        this.camera.detachCamera();
    }

    public createNodes() {

    }

    public init(registerName: string, queryName: string) {
        this.scene.name = registerName;
        this.cameraComp.node.name = registerName + 'camera';

        this.previewBuffer = new PreviewBuffer(registerName, queryName, this.scene);
    }

    resetCamera(modelNode: Node) {
        this.camera.changeTargetWindow(this.previewBuffer.window);
        tempVec3A.set(0, 1, 2.5);
        this.cameraComp.node.setPosition(tempVec3A);
        this.cameraComp.node.lookAt(Vec3.ZERO);
        modelNode.getWorldPosition(tempVec3B);
        Vec3.set(this.viewCenter, 0, 0, 0);
        this.viewDist = Vec3.distance(tempVec3A, tempVec3B);
        cce.Engine.repaintInEditMode();
    }

    protected destroyNode() {
        if (this.node && isValid(this.node, true)) {
            this.node.setParent(null);
            this.node._destroyImmediate();
            this.node = null;
        }
    }

    protected perfectCameraView(boundary: geometry.AABB | null | undefined) {
        this.viewDist = this.getFitDistance(boundary);

        this.cameraComp.node.getWorldRotation(this._curRot);

        Vec3.transformQuat(tempVec3A, Vec3.UNIT_Z, this._curRot);
        Vec3.multiplyScalar(tempVec3A, tempVec3A, this.viewDist);
        Vec3.add(tempVec3B, this.viewCenter, tempVec3A);
        this.cameraComp.node.setWorldPosition(tempVec3B);

        this.cameraComp.node.lookAt(this.viewCenter);
        cce.Engine.repaintInEditMode();
    }

    protected getFitDistance(boundary: geometry.AABB | null | undefined) {
        if (!boundary) {
            return 0;
        }
        this.viewCenter = boundary.center;
        const maxRange = boundary.halfExtents.length();

        //  为了让距离看起来更舒适
        const distScalar = 1.2;
        const fov = this.cameraComp.fov;
        const depthSize = Math.tan(((fov / 2) * Math.PI) / 180);
        const dist = (maxRange * distScalar) / depthSize;
        this.cameraComp.near = dist - maxRange;
        this.cameraComp.far = dist + maxRange;

        return dist;
    }

    public onMouseDown(event: any) {
        this.isMouseDown = true;

        this.cameraComp.node.getWorldRotation(this._curRot);
        this.cameraComp.node.getWorldPosition(this._curPos);

        if ((event.button === EventMouse.BUTTON_LEFT || !event.button)) {
            this.isMouseLeft = true;
        }

        this.cameraComp.node.getWorldRotation(this.curCameraRot);
    }

    public onMouseMove(event: any) {
        if (!this.isMouseDown) { return; }

        if (this.isMouseLeft) {
            this.rotate(event.movementX | 0, event.movementY | 0);
        }
    }

    public onMouseUp(event: any) {
        this.isMouseDown = false;
        this.isMouseLeft = false;
    }

    public onMouseWheel(event: any) {
        this.scale(event.wheelDeltaY);
    }

    protected scale(delta: number) {
        if (this._flipWheelDirection) {
            delta = -delta;
        }

        const finalDelta = ((this.cameraComp.far - this.cameraComp.near) / 100);
        const node = this.cameraComp.node;
        const curPos = this._curPos;
        const forward = this._forward;
        const v3a = this._v3a;

        node.getWorldPosition(curPos);
        node.getWorldRotation(this._curRot);
        Vec3.transformQuat(forward, Vec3.UNIT_Z, this._curRot);

        Vec3.multiplyScalar(v3a, forward, finalDelta * Math.sign(delta));
        Vec3.add(curPos, curPos, v3a);
        makeVec3InRange(curPos, -1e12, 1e12);
        const tempDist = Vec3.distance(curPos, this.viewCenter);
        const min = this.cameraComp.near * 2;
        const max = this.cameraComp.far / 3;

        // if (tempDist > min && max > tempDist) {
        this.viewDist = tempDist;
        node.setWorldPosition(curPos);
        // }

    }

    protected rotate(dx: number, dy: number) {
        if (!this.isMouseDown && !this.isMouseLeft) { return; }
        this.cameraComp.node.getWorldRotation(this._curRot);
        const rot = this._curRot;
        const euler = cc.v3();

        Quat.rotateX(rot, rot, -dy * this.orbitRotateSpeed);
        Quat.rotateAround(rot, rot, Vec3.UNIT_Y, -dx * this.orbitRotateSpeed);
        Quat.toEuler(euler, rot);

        Quat.fromEuler(rot, euler.x, euler.y, 0); // clear rotate of z
        const offset = cc.v3(0, 0, 1);
        Vec3.transformQuat(offset, offset, rot);
        Vec3.normalize(offset, offset);

        Vec3.multiplyScalar(offset, offset, this.viewDist);
        Vec3.add(this._curPos, this.viewCenter, offset);
        this.cameraComp.node.setWorldPosition(this._curPos);

        const up = cc.v3(0, 1, 0);
        Vec3.transformQuat(up, up, rot);
        Vec3.normalize(up, up);
        this.cameraComp.node.lookAt(this.viewCenter, up);
    }

    public setZoom(scale: number) {
        //向前滚动 > 0 向后滚动 < 0
        this.cameraComp.node.lookAt(this.cameraComp.camera.forward);
        this.cameraComp.node.worldPosition.add(this.cameraComp.camera.forward.multiplyScalar(scale));
        this.cameraComp.node.setWorldPosition(this.cameraComp.node.worldPosition);
        this.viewDist = Vec3.distance(this.cameraComp.node.worldPosition, this.viewCenter);
    }

    public hide() {
        this.cameraComp.enabled = false;
    }
}

export { InteractivePreview };
