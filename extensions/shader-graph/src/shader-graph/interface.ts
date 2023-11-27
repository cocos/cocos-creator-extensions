import type { PinData } from '../block-forge/interface';
import { generateUUID } from './utils';

/**
 * 用存储 Graph Property 数据
 */
export class PropertyData {
    id: string = generateUUID();
    type = '';
    name = '';
    /**
     * 声明的类型，目前是 PropertyNode
     */
    declareType = 'PropertyNode';
    outputPins: PinData[] = [];
}

/**
 * 节点的一些附带信息
 */
export interface INodeDetails {
    propertyID?: string;
    title?: string;
    subGraph?: string;
    inputPins?: PinData[],
    outputPins?: PinData[],

    [key: string]: any;
}
