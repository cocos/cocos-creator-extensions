import type { FloatWindowConfig } from './internal';

import FloatWindow from './base';
import * as GraphProperty from './graph-property';
import * as CustomNodes from './custom-nodes';
import * as CreateNode from './create-node';
import * as Preview from './preview';

export * from './internal';

const floatWindowMap = new Map<string, any/*DefineComponent*/>([
    [
        GraphProperty.DefaultConfig.key,
        GraphProperty.component,
    ],
    [
        CreateNode.DefaultConfig.key,
        CreateNode.component,
    ],
    [
        Preview.DefaultConfig.key,
        Preview.component,
    ],
    [
        CustomNodes.DefaultConfig.key,
        CustomNodes.component,
    ],
]);

export const floatWindowConfigs: Map<string, FloatWindowConfig> = new Map();

export function getFloatWindowConfigByName(name: string): FloatWindowConfig | undefined {
    return floatWindowConfigs.get(name);
}

export async function updateFloatWindowConfigs() {
    const configs = [
        GraphProperty.getConfig(),
        Preview.getConfig(),
        CreateNode.getConfig(),
        CustomNodes.getConfig(),
    ];
    configs.forEach(config => {
        floatWindowConfigs.set(config.key, config);
    });
    return configs;
}

function getFloatWindowMap() {
    return floatWindowMap;
}

export {
    FloatWindow,
    getFloatWindowMap,
};
