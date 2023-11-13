import type { LineInfo } from '@itharbors/ui-graph';
import type { BlockData } from './block';

import type { GraphMouseEvent, BlockMouseEvent, LineMouseEvent, BlockEvent, LineEvent } from '../event';

/*
 * 序列化需要的数据
 */

// Graph 的序列化数据
export interface GraphData<D extends Object = {[key: string]: any;}> {
    type: string,
    name?: string,
    nodes: {
        [uuid: string]: BlockData;
    };
    lines: {
        [uuid: string]: LineData;
    };
    graphs: {
        [uuid: string]: GraphData;
    };
    details: D;
}

// Line 的序列化数据
// 因为 line 没有单独的类型和文件，暂放这里
export interface LineData<D extends Object = {[key: string]: any;}> {
    type: string;
    details: D;
    output: {
        node: string;
        param: string;
    };
    input: {
        node: string;
        param: string;
    };
}

/**
 * 注册时的定义
 */

// Graph 数据格式
export interface IGraphDescription {
    type: string;
    feature?: IGraphFeature;
    style?: IGraphStyle;
    validator?: IGraphDefineValidator;
    event?: IGraphDefineEvent;
}

// Graph 上可以定义的校验函数
interface IGraphDefineValidator {
    // 连线
    dataLink?(nodes: any, lines: any, line: any, input: any, output: any): boolean;
    execLink?(nodes: any, lines: any, line: any, input: any, output: any): boolean;
    deleteLine?(...args: any[]): boolean;

    // 节点
    createNode?(...args: any[]): boolean;
    deleteNode?(...args: any[]): boolean;
}

// Graph 上可以定义的事件钩子
export interface IGraphDefineEvent {
    // Block 选中事件
    onBlockSelected?(event: BlockEvent): boolean;
    onBlockUnselected?(event: BlockEvent): boolean;

    // Line 选中事件
    onLineSelected?(event: LineEvent): boolean;
    onLineUnselected?(event: LineEvent): boolean;

    // Block 点击事件
    onBlockClick?(event: BlockMouseEvent): boolean;
    onBlockRightClick?(event: BlockMouseEvent): boolean;
    onBlockDblClick?(event: BlockMouseEvent): boolean;

    // Line 点击事件
    onLineClick?(event: LineMouseEvent): boolean;
    onLineRightClick?(event: LineMouseEvent): boolean;
    onLineDblClick?(event: LineMouseEvent): boolean;

    // Graph 点击事件
    onGraphRightClick?(event: GraphMouseEvent): unknown;

    // 连线
    onLineCreated?(event: LineEvent): boolean;
    onLineDeleted?(event: LineEvent): boolean;

    // 节点
    onBlockCreated?(event: BlockEvent): boolean;
    onBlockDeleted?(event: BlockEvent): boolean;
}

// Graph 上可配置的数据
interface IGraphFeature {
}

interface IGraphStyle {
    // 背景颜色
    backgroundColor?: string;
    // 网格尺寸
    gridSize?: number;
    // mesh 颜色
    gridColor?: string;
    // 原点坐标是否显示
    showOriginPoint?: boolean;
    // origin 颜色
    originPointColor?: string;
}
