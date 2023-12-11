import { join } from 'path';
import { load } from 'js-yaml';
import { ensureDirSync, readFile, writeFile, existsSync } from 'fs-extra';

module.paths.push(join(Editor.App.path, 'node_modules'));

const { Asset } = require('@editor/asset-db');

import { Block, Forge } from '../block-forge';
import { GraphData } from '../block-forge/interface';
import { IModuleOptions, declareShaderNodeBlock } from '../shader-graph';
import { generateEffectAsset } from './utils-3.8';

const VectorDataType = [
    'float',
    'vec2',
    'vec3',
    'vec4',
    'color',
    'enum',
    'boolean',
];

export class ShaderGraph {

    get assetType() {
        return 'cc.EffectAsset';
    }

    get version() {
        return '1.0.0';
    }

    get name() {
        return 'shader-graph';
    }

    get migrations() {
        return [];
    }

    shaderNodeClassMap: Map<string, any> = new Map;
    shaderContext: any;
    ShaderProperty: any;

    /**
     * 用于存储每个 asset 对应的 source
     * 导入前先换成，把 source 替换成 temp 路径下的 effect
     * 导入后在替换成原本的 source
     */
    public cacheSourceMap: Map<string, string> = new Map();

    _initedGraph = false;
    async initGraph() {
        if (this._initedGraph && this.shaderContext?.shaderTemplatesDir) {
            return;
        }

        await Editor.Module.importProjectModule('db://shader-graph/operation/index.ts');

        const { ShaderProperty } = await Editor.Module.importProjectModule('db://shader-graph/operation/property.ts') as any;
        this.ShaderProperty = ShaderProperty;

        const { shaderNodeMap, shaderPropertyMap, shaderNodeClassMap } = await Editor.Module.importProjectModule('db://shader-graph/graph/index.ts') as IModuleOptions;

        const { shaderContext } = await Editor.Module.importProjectModule('db://shader-graph/operation/context.ts') as any;
        declareShaderNodeBlock(shaderNodeMap);

        this.shaderNodeClassMap = shaderNodeClassMap;
        this.shaderContext = shaderContext;

        shaderContext.shaderTemplatesDir = await Editor.Message.request('asset-db', 'query-path', 'db://shader-graph/../compile-shader/shader-templates') as string;
        // shaderContext.shaderTemplatesDir = queryPath('db://shader-graph/../compile-shader/shader-templates');
        this._initedGraph = true;
    }

    createShaderNodes(blockMap: {
        [uuid: string]: Block;
    }) {
        const shaderNodeClassMap = this.shaderNodeClassMap;
        const shaderContext = this.shaderContext;

        for (const uuid in blockMap) {
            const block = blockMap[uuid];
            if (!block.desc) continue;
            const type = block.desc.type;

            let shaderNode = (block as any).shaderNode;
            if (!shaderNode) {
                const cls = shaderNodeClassMap.get(type);
                if (!cls) {
                    console.error(`Can not find type for ${type}`);
                }
                shaderNode = new cls();
                shaderNode.init();
                shaderNode.block = block;

                if (!shaderContext.allNodes.includes(shaderNode)) {
                    shaderContext.allNodes.push(shaderNode);
                }
                if (type === 'RegisterLocalVar') {
                    if (!shaderContext.localVars.includes(shaderNode)) {
                        shaderNode.name = block.getInputPinsList()[1].value.value;
                        shaderContext.localVars.push(shaderNode);
                    }
                }
                if (type === 'GetLocalVar') {
                    if (!shaderContext.getLocalVars.includes(shaderNode)) {
                        shaderNode.name = block.getInputPinsList()[0].value.value;
                        shaderContext.getLocalVars.push(shaderNode);
                    }
                }
                if (type === 'PropertyNode') {
                    shaderNode.name = block.block.details.title;
                }

                const inputPins = block.getInputPinsList();

                for (let i = 0; i < inputPins.length; i++) {
                    const pin = inputPins[i];
                    const value = pin.value;
                    const input = shaderNode.inputs[i];

                    let slot = shaderNode.getSlotWithSlotName(pin.desc.name);
                    if (!slot) {
                        slot = shaderNode.getPropWithName(pin.desc.name);
                    }

                    if (VectorDataType.includes(value.dataType)) {
                        if (slot) {
                            if (typeof value.value === 'number' || typeof value.value === 'boolean') {
                                slot.value = value.value;
                            }
                            else if (value.dataType === 'color') {
                                // srgb to linear
                                slot.value.set(
                                    value.value.x * value.value.x,
                                    value.value.y * value.value.y,
                                    value.value.z * value.value.z,
                                    value.value.w,
                                );
                            }
                            else if (value.dataType === 'enum') {
                                slot.value = value.value;
                            }
                            else if (value.dataType === 'dynamicEnum') {
                                // TODO
                            }
                            else {
                                slot.value.set(value.value);
                            }
                        }
                    }
                }

                (block as any).shaderNode = shaderNode;
            }
        }
    }

    searchInputs(block: Block) {
        const shaderNode = (block as any).shaderNode;
        const inputList = block.getInputPinsList();
        for (let i = 0; i < inputList.length; i++) {
            const pin = inputList[i];
            if (!shaderNode.inputs[i]) {
                continue;
            }

            const connectPin = pin.connectPins[0];
            if (connectPin) {
                const connectBlock = connectPin.block;
                const connectShaderNode = (connectBlock as any).shaderNode;
                const connectOutIdx = connectPin.block.getOutputPinsList().indexOf(connectPin);
                const connectSlot = connectShaderNode.outputs[connectOutIdx];

                shaderNode.inputs[i].connectSlots[0] = connectSlot;
                connectSlot.connectSlots.push(shaderNode.inputs[i]);

                this.searchInputs(connectBlock);
            }
            else {
                shaderNode.inputs[i].connectSlots.length = 0;
            }
        }
    }

    public async generateMasterNode(graphData: GraphData) {
        await this.initGraph();

        const forge = new Forge(graphData);

        const graph = forge.getGraph();

        this.shaderContext.reset();

        // TODO 这里还需要处理子图的 properties
        const properties = graph.details.properties;
        if (properties) {
            properties.forEach((v: any) => {
                const prop = new this.ShaderProperty(v.type);
                prop.name = v.name;
                prop.setValue(v.outputPins[0].value);
                this.shaderContext.properties.push(prop);
            });
        }

        const blockMap = graph.getBlockMap();

        await this.createShaderNodes(blockMap);

        let masterBlock;
        for (const uuid in blockMap) {
            const block = blockMap[uuid];
            if (!block.desc) continue;
            const type = block.desc.type;
            if (type.includes('MasterNode')) {
                masterBlock = block;
            }
        }

        if (!masterBlock) {
            throw new Error('Can not find MasterBlock');
        }

        for (let i = 0; i < this.shaderContext.localVars.length; i++) {
            const locVar = this.shaderContext.localVars[i];
            await this.searchInputs(locVar.block);
        }
        await this.searchInputs(masterBlock);

        const masterNode = (masterBlock as any).shaderNode;
        return masterNode;
    }

    public async generateEffectByGraphData(graphData: GraphData) {
        const masterNode = await this.generateMasterNode(graphData);
        return masterNode.generateCode();
    }

    // @ts-expect-error
    public async generateEffectByAsset(asset: Asset) {
        const serializeYAML = await readFile(asset.source, 'utf8');

        const graphData = load(serializeYAML) as GraphData;

        const code = await this.generateEffectByGraphData(graphData);

        ensureDirSync(this.tempEffectCodeDir);
        await writeFile(this.getTempEffectCodePath(asset), code);
        return code;
    }

    // @ts-expect-error
    public existsCacheEffect(asset: Asset) {
        return existsSync(this.getTempEffectCodePath(asset));
    }

    /**
     * 获取存储 effect code 文件夹
     */
    // @ts-expect-error
    public getTempEffectCodePath(asset: Asset): string {
        return join(this.tempEffectCodeDir, `${asset.uuid}.effect`);
    }

    /**
     * 获取存储 effect code 路径
     */
    public get tempEffectCodeDir() {
        return join(Editor.Project.tmpDir, `shader-graph`);
    }

    /**
     * 返回是否导入成功的标记
     * 如果返回 false，则 imported 标记不会变成 true
     * 后续的一系列操作都不会执行
     * @param asset
     */
    // @ts-expect-error
    public async import(asset: Asset) {
        await generateEffectAsset(asset, await this.generateEffectByAsset(asset));
        return true;
    }
}

export default new ShaderGraph();
