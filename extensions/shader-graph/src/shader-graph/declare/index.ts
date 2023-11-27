import type { BlockTemplateData } from '../internal';

import {
    normalBlockCacheMap,
    declareShaderNodeBlock,
} from './block';
import { Menu } from '../menu';
import { declareGraph, hasDeclareGraph } from '../../block-forge';
import { createDefaultGraph } from './graph';
import { MessageMgr, MessageType } from '../base';
import { PropertyDefine } from '../../../@types/shader-node-type';
import { BlockData } from '../../block-forge/interface';

let shaderNodeMap = new Map();
let shaderPropertyMap = new Map();

function getPropertyDefineByType(type: string) {
    return shaderPropertyMap.get(type);
}

async function declareGraphBlock() {
    const { shaderNodeList, shaderPropertyList } = await MessageMgr.Instance.callSceneMethod('queryShaderNode');
    shaderNodeMap = new Map(shaderNodeList);
    shaderPropertyMap = new Map(shaderPropertyList);

    declareShaderGraph();
    declareShaderNodeBlock(shaderNodeMap);
    applyBlockToMenu();

    MessageMgr.Instance.send(MessageType.Declared);
}

function iteratePropertyDefines(handle: (define: PropertyDefine) => void) {
    shaderPropertyMap.forEach((define: PropertyDefine) => handle(define));
}

async function getBlockDataByType(type: string): Promise<BlockData | undefined> {
    let block = getBlockTemplateByType(type);
    if (!block) {
        await declareGraphBlock();
    }
    block = getBlockTemplateByType(type);
    if (!block) {
        console.log(`create default shader graph failed, MasterNode: ${type}`);
        return;
    }
    return JSON.parse(JSON.stringify(block.data));
}

function declareShaderGraph() {
    const defaultGraph = createDefaultGraph();
    if (hasDeclareGraph(defaultGraph.type)) return;

    declareGraph(defaultGraph);
}

function applyBlockToMenu() {
    normalBlockCacheMap.forEach((block: BlockTemplateData) => {
        if (block.details?.menu) {
            Menu.Instance.addItemPath(block.details.menu, {
                type: block.data.type,
                details: {},
            });
        }
    });
}

function getBlockTemplateByType(type: string): BlockTemplateData | undefined {
    const blockTemplate = normalBlockCacheMap.get(type);
    if (blockTemplate) {
        return JSON.parse(JSON.stringify(blockTemplate));
    }
    console.debug(`get block templates not available by type: ${type}`);
}

export {
    declareShaderGraph,
    declareShaderNodeBlock,
    getBlockTemplateByType,
    getPropertyDefineByType,
    getBlockDataByType,
    iteratePropertyDefines,
    declareGraphBlock,
    applyBlockToMenu,
};
