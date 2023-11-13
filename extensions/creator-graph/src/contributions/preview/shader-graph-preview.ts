'use strict';

import {
    DirectionalLight,
    gfx,
    Material,
    Mesh,
    MeshRenderer,
    primitives,
    Quat,
    Renderer,
    renderer,
    utils,
    Vec3,
    director,
    Node,
} from 'cc';

declare const cc: any;
declare const EditorExtends: any;
declare const isSceneNative: boolean;

import { InteractivePreview } from './Interactive-preview';
const regions = [new gfx.BufferTextureCopy()];
regions[0].texExtent.depth = 1;

function insertAdditionals(geometry: primitives.IGeometry) {
    if (!geometry.customAttributes) {
        geometry.customAttributes = [];
    }
    geometry.customAttributes.push({
        attr: new gfx.Attribute(gfx.AttributeName.ATTR_TANGENT, gfx.Format.RGBA32F),
        values: EditorExtends.GeometryUtils.calculateTangents(geometry.positions, geometry.indices!, geometry.normals!, geometry.uvs!) as number[],
    });
    return geometry;
}

interface IPrimitiveInfo {
    mesh: Mesh;
    scale: Vec3;
}

const primitiveData: Record<string, IPrimitiveInfo> = {
    box: {
        mesh: utils.createMesh(insertAdditionals(primitives.box())),
        scale: new Vec3(1, 1, 1),
    },
    sphere: {
        mesh: utils.createMesh(insertAdditionals(primitives.sphere())),
        scale: new Vec3(1, 1, 1),
    },
    capsule: {
        mesh: utils.createMesh(insertAdditionals(primitives.capsule())),
        scale: new Vec3(0.8, 0.8, 0.8),
    },
    cylinder: {
        mesh: utils.createMesh(insertAdditionals(primitives.cylinder())),
        scale: new Vec3(0.8, 0.8, 0.8),
    },
    torus: {
        mesh: utils.createMesh(insertAdditionals(primitives.torus())),
        scale: new Vec3(1, 1, 1),
    },
    cone: {
        mesh: utils.createMesh(insertAdditionals(primitives.cone())),
        scale: new Vec3(1, 1, 1),
    },
    quad: {
        mesh: utils.createMesh(insertAdditionals(primitives.quad())),
        scale: new Vec3(1, 1, 1),
    },
};

const tempVec3A = new Vec3();
const tempVec3B = new Vec3();
const tempQuatA = new Quat();

const _matInsInfo = {
    parent: null! as Material,
    owner: null! as Renderer,
    subModelIdx: 0,
};

class ShaderGraphPreview extends InteractivePreview {
    private lightComp!: DirectionalLight;
    private modelComp!: MeshRenderer;
    private primitive = 'sphere';
    private material: Material | null = null;

    private dummyUniformBuffer!: gfx.Buffer;

    private dummyStorageTexture!: gfx.Texture;
    private dummySampleTexture!: gfx.Texture;
    private dummySampler!: gfx.Sampler;

    private dummyStorageBuffer!: gfx.Buffer;
    private uniformBuffer!: gfx.Buffer;
    private storageBuffer!: gfx.Buffer;

    private cacheMeshs: Record<string, Mesh> = {};

    public init(registerName: string, queryName: string) {
        super.init(registerName, queryName);

        const device = director.root!.device;

        this.uniformBuffer = device.createBuffer(new gfx.BufferInfo(
            gfx.BufferUsageBit.UNIFORM,
            gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
            16,
        ));
        this.dummyUniformBuffer = device.createBuffer(new gfx.BufferViewInfo(this.uniformBuffer, 0, this.uniformBuffer.size));

        this.storageBuffer = !isSceneNative ? this.uniformBuffer : device.createBuffer(new gfx.BufferInfo(
            gfx.BufferUsageBit.STORAGE,
            gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
            16,
        ));
        this.dummyStorageBuffer = !isSceneNative ? this.dummyUniformBuffer :
            device.createBuffer(new gfx.BufferViewInfo(this.storageBuffer, 0, this.storageBuffer.size));

        this.dummySampleTexture = device.createTexture(new gfx.TextureInfo(
            gfx.TextureType.TEX2D,
            gfx.TextureUsageBit.SAMPLED,
            gfx.Format.RGBA8,
            4, 4,
        ));
        this.dummyStorageTexture = !isSceneNative ? this.dummySampleTexture : device.createTexture(new gfx.TextureInfo(
            gfx.TextureType.TEX2D,
            gfx.TextureUsageBit.STORAGE,
            gfx.Format.RGBA8,
            4, 4,
        ));
        this.dummySampler = device.getSampler(new gfx.SamplerInfo());

    }

    public createNodes() {
        this.lightComp = new cc.Node('Shader Graph Preview Light').addComponent(DirectionalLight);
        this.lightComp.node.setRotationFromEuler(-45, -45, 0);
        this.lightComp.node.setParent(this.scene);

        this.modelComp = new Node('Shader Graph Preview Model').addComponent(MeshRenderer);
        this.modelComp.mesh = primitiveData.sphere.mesh;
        const material = new Material();
        material.initialize({ effectName: 'builtin-standard' });
        this.modelComp.material = material;
        this.setMaterial(material);

        this.modelComp.node.setParent(this.scene);
    }

    public setMaterial(material: Material | null) {
        if (material && material !== this.material) {
            const comp = this.modelComp;
            _matInsInfo.parent = material;
            _matInsInfo.owner = comp;
            const instantiated = new renderer.MaterialInstance(_matInsInfo);
            comp.material = instantiated;
            this.material = material;
            this.updateDs();
            this.cameraComp.enabled = true;
            this.cameraComp.node.getWorldPosition(tempVec3A);
            this.modelComp.node.getWorldPosition(tempVec3B);
            this.viewDist = Vec3.distance(tempVec3A, tempVec3B);
        }
    }

    // 部分材质如果没有调用该方法会有报错，如spine相关材质
    // 大部分材质不需要调用也会正常预览
    public updateDs() {
        const model = this.modelComp.model;
        if (model) {
            for (let i = 0; i < model.subModels.length; i++) {
                const ds = model.subModels[i].descriptorSet;
                const bindings = ds.layout.bindings;
                const device = director.root!.device;
                for (let j = 0; j < bindings.length; j++) {
                    const desc = bindings[j];
                    const binding = desc.binding;
                    const dsType = desc.descriptorType;
                    // bind buffer
                    if (dsType & gfx.DescriptorType.UNIFORM_BUFFER ||
                        dsType & gfx.DescriptorType.DYNAMIC_UNIFORM_BUFFER) {
                        if (!ds.getBuffer(binding)) { ds.bindBuffer(binding, this.dummyUniformBuffer); }
                    } else if (dsType & gfx.DescriptorType.STORAGE_BUFFER ||
                        dsType & gfx.DescriptorType.DYNAMIC_STORAGE_BUFFER) {
                        if (!ds.getBuffer(binding)) { ds.bindBuffer(binding, this.dummyStorageBuffer); }
                    }
                    // binde texture
                    else if (dsType & gfx.DESCRIPTOR_SAMPLER_TYPE) {
                        if (!ds.getTexture(binding)) {
                            if (dsType & gfx.DescriptorType.SAMPLER_TEXTURE ||
                                dsType & gfx.DescriptorType.TEXTURE) {
                                ds.bindTexture(binding, this.dummySampleTexture);
                            } else if (dsType & gfx.DescriptorType.STORAGE_IMAGE) {
                                ds.bindTexture(binding, this.dummyStorageTexture);
                            }

                        }
                        if (!ds.getSampler(binding)) { ds.bindSampler(binding, this.dummySampler); }
                    }
                }
                ds.update();
            }
        }
    }

    private setMesh(primitive: string, mesh: Mesh, scale: Vec3 = Vec3.ONE) {
        this.modelComp.mesh = mesh;
        // 在部分情况下，该接口会先于setMaterial调用 #12259
        // 如果上个材质刚好和目标材质类型不同，就会导致引擎底层无法正确绑定纹理，从而报错
        this.updateDs();
        this.modelComp.node.setScale(scale);
        this.primitive = primitive;
        this.cameraComp.enabled = true;
    }

    public setPrimitive(primitive: string) {
        if (primitive && primitive !== this.primitive) {
            const cacheMesh = this.cacheMeshs[primitive];
            if (!cacheMesh) {
                cc.assetManager.loadAny(primitive, (err: Error, mesh: Mesh) => {
                    if (err) {
                        return console.error(err);
                    }
                    this.cacheMeshs[primitive] = mesh;
                    this.setMesh(primitive, mesh);
                });
            } else {
                this.setMesh(primitive, cacheMesh);
            }
        }
    }

    public setLightEnable(enable: boolean) {
        if (this.lightComp.enabled !== enable) {
            this.lightComp.enabled = enable;
        }
    }

    public resetCamera() {
        super.resetCamera(this.modelComp.node);
    }
}

const shaderGraphPreview = new ShaderGraphPreview();

export { shaderGraphPreview };
