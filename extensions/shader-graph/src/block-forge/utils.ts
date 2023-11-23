'use strict';

import type { IBlockDescription, GraphData, BlockData, PinData, ForgeData } from './interface';
import type { GraphNodeElement } from '@itharbors/ui-graph/dist/element/graph-node';

/**
 * 补全 target 上的配置对象
 * 将 extend 里的属性补充到 target 上
 * @param target
 * @param extend
 */
export function completeBlockTarget(target: IBlockDescription, extend: IBlockDescription) {
    target.feature = Object.assign(Object.create(extend.feature || {}), target.feature || {});
    target.style = Object.assign(Object.create(extend.style || {}), target.style || {});
}

export function generateUUID() {
    return 't_' + Date.now() + (Math.random() + '').substring(10);
}

export function generateGraph(type: string, name?: string): GraphData {
    return {
        type,
        name: name || type,
        nodes: {},
        lines: {},
        graphs: {},
        details: {},
    };
}

export function generateBlock(type: string): BlockData {
    return {
        type,
        position: { x: 0, y: 0 },
        details: {},
    };
}

export function generatePin(type: string): PinData {
    return {
        dataType: type,
        value: {},
        details: {},
    };
}

/**
 * 发送一个自定义消息
 * @param elem 
 * @param eventName 
 * @param options 
 */
export function dispatch<T>(elem: HTMLElement, eventName: string, options?: EventInit & { detail: T }) {
    const targetOptions = {
        bubbles: true,
        cancelable: true,
    };
    if (options) {
        Object.assign(targetOptions, options);
    }
    const event = new CustomEvent<T>(eventName, targetOptions);
    elem.dispatchEvent(event);
}

/**
 *
 */
export function createGraph(forge: ForgeData, type: string) {
    // TODO
}

/**
 *
 */
export function createBlock() {
    // TODO
}

/**
 *
 */
export function createPin() {
    // TODO
}
