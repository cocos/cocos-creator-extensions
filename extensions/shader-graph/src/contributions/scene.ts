import type { IModuleOptions } from '../shader-graph';
import type { NodeDefine, PropertyDefine, SlotDefine } from '../../@types/shader-node-type';
import previewScene from './preview-scene';
import { PreviewConfig } from './internal';
import { GraphData } from '../block-forge/interface';

import shaderGraph from '../importer/shader-graph';

import { addChunks } from './effect-header';
import { buildEffect } from '../effect-utils';

declare const cce: any;

function createSlot(slot: SlotDefine) {
    const valueDump = cce.Dump.encode.encodeObject(slot.default, { default: slot.default });
    return {
        default: valueDump.value,
        type: slot.type,
        connectType: slot.connectType,
        display: slot.display,
        enum: slot.enum,
        registerEnumType: slot.registerEnumType,
        registerEnum: slot.registerEnum,
    };
}

exports.methods = {
    async queryShaderNode() {
        const { shaderNodeMap, shaderPropertyMap } = await Editor.Module.importProjectModule('db://shader-graph/graph/index.ts') as IModuleOptions;

        const shaderNodeList: Map<string, NodeDefine> = new Map();
        shaderNodeMap.forEach((nodeDefine: NodeDefine) => {
            const newNodeDefine: NodeDefine = {
                type: nodeDefine.type,
                extend: nodeDefine.extend,
                details: nodeDefine.details,
                node: {},
            };

            nodeDefine.node.inputs?.forEach((slot) => {
                if (!newNodeDefine.node.inputs) {
                    newNodeDefine.node.inputs = [];
                }
                newNodeDefine.node.inputs.push(createSlot(slot));
            });
            nodeDefine.node.props?.forEach((slot) => {
                if (!newNodeDefine.node.props) {
                    newNodeDefine.node.props = [];
                }
                newNodeDefine.node.props.push(createSlot(slot));
            });
            nodeDefine.node.outputs?.forEach((slot) => {
                if (!newNodeDefine.node.outputs) {
                    newNodeDefine.node.outputs = [];
                }
                newNodeDefine.node.outputs.push(createSlot(slot));
            });
            shaderNodeList.set(newNodeDefine.type, newNodeDefine);
        });

        const shaderPropertyList: Map<string, PropertyDefine> = new Map();
        shaderPropertyMap.forEach((propertyDefine: PropertyDefine) => {
            const valueDump = cce.Dump.encode.encodeObject(propertyDefine.default, { default: propertyDefine.default });
            const newPropertyDefine: PropertyDefine = {
                name: propertyDefine.name,
                type: propertyDefine.type,
                declareType: propertyDefine.declareType,
                default: valueDump.value,
                details: propertyDefine.details,
                outputs: [],
            };
            propertyDefine.outputs.forEach((slot: SlotDefine) => {
                newPropertyDefine.outputs.push(createSlot(slot));
            });
            shaderPropertyList.set(newPropertyDefine.type, newPropertyDefine);

        });
        return {
            shaderNodeList: [...shaderNodeList],
            shaderPropertyList: [...shaderPropertyList],
        };
    },

    async queryPropertyValueDumpByType(type: string, value: any) {
        const { shaderPropertyMap } = await Editor.Module.importProjectModule('db://shader-graph/graph/index.ts') as IModuleOptions;
        const propertyDefine: PropertyDefine = shaderPropertyMap.get(type)!;
        const valueDump = cce.Dump.encode.encodeObject(propertyDefine.default, {});
        valueDump.value = value;
        return valueDump;
    },

    async initPreview(config: PreviewConfig) {
        try {
            await addChunks();
            await previewScene.init(config);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    async updateMaterial(graphData: GraphData) {
        if (!graphData) return;

        const time = Date.now();
        const masterNode = await shaderGraph.generateMasterNode(graphData);

        const material = await masterNode.createMaterial(buildEffect);
        previewScene.setMaterial(material);

        console.debug('update shader graph material : ' + (Date.now() - time) / 1000);
    },

    registerEffects(uuid: string) {
        console.debug('registerEffects: ' + uuid);
        cce.SceneFacadeManager.registerEffects([uuid]);
    },

    removeEffects(uuid: string) {
        console.debug('removeEffects:' + uuid);
        cce.SceneFacadeManager.removeEffects([uuid]);
    },

    updateEffect(uuid: string) {
        console.debug('updateEffect:' + uuid);
        cce.SceneFacadeManager.updateEffect([uuid]);
    },
};
