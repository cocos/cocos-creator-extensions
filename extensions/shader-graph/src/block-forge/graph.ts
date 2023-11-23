'use strict';

import type { IGraphDescription } from './interface';
import { registerGraphOption } from '@itharbors/ui-graph';
import { registerGraphFilter } from '@itharbors/ui-graph/dist/manager';

interface GraphInfo {
    graph: IGraphDescription;
}
export const graphMap: Map<string, GraphInfo> = new Map();

class GraphObject {

}

export const hasDeclareGraph = function(type: string) {
    return graphMap.has(type);
};

export const getDeclareGraph = function(type: string) {
    return graphMap.get(type);
};

/**
 * 注册一个 graph 类型
 * @param graph
 */
export function declareGraph(graph: IGraphDescription) {
    if (hasDeclareGraph(graph.type)) {
        console.warn(`Cannot declare duplicate graph types: ${graph.type}`);
        return;
    }

    // 在底层注册一个渲染图类型
    const config = Object.assign({}, graph.style, graph.feature);
    registerGraphOption(graph.type, config);
    registerGraphFilter(graph.type, {
        lineFilter: graph.validator?.dataLink,
    });

    graphMap.set(graph.type, {
        graph: graph,
    });
}

