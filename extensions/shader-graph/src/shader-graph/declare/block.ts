import type { BlockTemplateData } from '../internal';
import type { BlockData, IBlockDescription, IPinDescription, PinData } from '../../block-forge/interface';
import type { PropertyDefine, NodeDefine, SlotDefine } from '../../../@types/shader-node-type';

import { declareBlock, declareEnum, declareDynamicEnumToType } from '../../block-forge';
import { generatePinID } from '../utils';

type SlotTag = 'input' | 'out' | 'prop';

export const normalBlockCacheMap: Map<string, BlockTemplateData> = new Map();

export const pinMap: Map<string, { data: PinData, description: IPinDescription }> = new Map();

export function createPinTag(blockType: string, slotTag: SlotTag, slot: SlotDefine) {
    return generatePinID(slotTag, blockType, slot.type, slot.display);
}
export function createPin(blockType: string, slotTag: SlotTag, slot: SlotDefine, details?: { [key: string]: any }) {
    const tag = createPinTag(blockType, slotTag, slot);
    const pinDescription: IPinDescription = {
        tag: tag,
        dataType: slot.type,
        value: slot.default,
        name: slot.display,
        hidePin: slotTag === 'prop',
        details: {},
    };
    const pinData: PinData = {
        dataType: pinDescription.dataType,
        value: pinDescription.value,
        details: details || {},
    };

    if (slot.type === 'enum' && slot.enum) {
        // 注册枚举
        const type = slot.enum._name || `${blockType}_${slot.display}`;
        declareEnum(type, slot.enum);
        pinData.value = slot.default;
        pinDescription.details.type = type;
    } else if (slot.type === 'dynamicEnum' && slot.registerEnum) {
        declareEnum(slot.registerEnum.type, {});
        pinData.value = '';
        pinDescription.details.type = slot.registerEnum.type;
        pinDescription.details.defaultValue = slot.default;
    }

    if ('registerEnumType' in slot) {
        pinDescription.details.registerEnumType = slot.registerEnumType;
    }

    // 用于判断连线
    if ('connectType' in slot) {
        pinDescription.details.connectType = slot.connectType;
    }

    return {
        tag: tag,
        data: pinData,
        description: pinDescription,
    };
}

function createBlockByNodeDefine(nodeDefine: NodeDefine) {
    const description: IBlockDescription = {
        type: nodeDefine.type,
        title: nodeDefine.details?.title || '',
        inputPins: [],
        outputPins: [],
        style: {
            headerColor: '#227F9B80',
        },
    };

    if (nodeDefine.details?.style !== undefined) {
        // 合并 style，已 dump 的 style 为主
        description.style = { ...description.style, ...nodeDefine.details?.style };
    }

    const blockData: BlockData = {
        type: nodeDefine.type,
        position: { x: 0, y: 0 },
        details: {
            inputPins: [],
            outputPins: [],
        },
    };
    return {
        isMaster: nodeDefine.details?.master,
        details: nodeDefine.details,
        type: blockData.type,
        data: blockData,
        description: description,
    };
}

/**
 * 注册到动态枚举中，如果 value 重复就递增 1
 * 例如 test test_1
 * @param pinData
 * @param pinDesc
 */
export function registerDynamicEnum(pinData: PinData, pinDesc: IPinDescription) {
    let value = pinData.value;
    let index = 1;
    let done = false;
    while (!done) {
        done = declareDynamicEnumToType({
            type: pinDesc.details.registerEnumType,
            name: value,
        });
        if (!done) {
            value = pinData.value + `_${index}`;
            index++;
        }
    }
    return value;
}

function createDynamicInputPins(blockDesc: IBlockDescription, details: {
    inputPins: PinData[];
    inputPinDescriptions?: IPinDescription[];
    [key: string]: any
}): IPinDescription[] {
    if (details.inputPinDescriptions) {
        return details.inputPinDescriptions.map((desc: IPinDescription, index: number) => {
            const pinData = details.inputPins[index];
            if (desc.details.registerEnumType) {
                pinData.details.registerEnumType = desc.details.registerEnumType;
                pinData.value = registerDynamicEnum(pinData, desc);
            }
            return desc;
        });
    } else {
        return blockDesc.inputPins.map((desc: IPinDescription, index: number) => {
            const newDesc = JSON.parse(JSON.stringify(desc));
            const pinData = details.inputPins[index];
            if (pinData) {
                if (newDesc.dataType === 'any') {
                    newDesc.dataType = pinData.dataType;
                    newDesc.value = pinData.value;
                }
                if (desc.details.registerEnumType) {
                    pinData.details.registerEnumType = desc.details.registerEnumType;
                    pinData.value = registerDynamicEnum(pinData, desc);
                }
            }
            return newDesc;
        });
    }
}

function createDynamicOutputPins(blockDesc: IBlockDescription, details: {
    outputPins: PinData[];
    outputPinDescriptions: IPinDescription[];
    [key: string]: any;
}): IPinDescription[] {
    if (details.outputPinDescriptions) {
        return details.outputPinDescriptions;
    }
    return blockDesc.outputPins.map((desc: IPinDescription, index: number) => {
        const newDesc = JSON.parse(JSON.stringify(desc));
        const pinData = details.outputPins[index];
        if (pinData && newDesc.dataType === 'any') {
            newDesc.dataType = pinData.dataType;
            newDesc.value = pinData.value;
        }
        return newDesc;
    });
}

export function declareShaderNodeBlock(shaderNodeMap: Map<string, NodeDefine>) {
    // 清空缓存
    normalBlockCacheMap.clear();
    pinMap.clear();
    for (const [blockType, item] of shaderNodeMap) {
        const inputPins: PinData[] = [];
        const inputPinDescriptions: IPinDescription[] = [];
        item.node.inputs?.forEach((slot: SlotDefine) => {
            const pin = createPin(blockType, 'input', slot);
            inputPins.push(pin.data);
            inputPinDescriptions.push(pin.description);

            pinMap.set(pin.tag, pin);
        });

        item.node.props?.forEach((slot: SlotDefine) => {
            const pin = createPin(blockType, 'prop', slot);

            inputPins.push(pin.data);
            inputPinDescriptions.push(pin.description);

            pinMap.set(pin.tag, pin);
        });

        const outputPins: PinData[] = [];
        const outputPinDescriptions: IPinDescription[] = [];
        item.node.outputs?.forEach((slot: SlotDefine) => {
            const pin = createPin(blockType, 'out', slot);
            outputPins.push(pin.data);
            outputPinDescriptions.push(pin.description);

            pinMap.set(pin.tag, pin);
        });

        const block = createBlockByNodeDefine(item);
        block.data.details.inputPins = inputPins;
        block.data.details.outputPins = outputPins;
        block.description.inputPins = inputPinDescriptions;
        block.description.outputPins = outputPinDescriptions;
        block.description.createDynamicInputPins = createDynamicInputPins;
        block.description.createDynamicOutputPins = createDynamicOutputPins;
        normalBlockCacheMap.set(block.type, block);
        // 注册
        declareBlock(block.description);
    }
}
