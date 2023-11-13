import type { ShaderNode } from '../operation/base';
import type { IRegisterOptions, NodeDefine, PropertyDefine } from '../operation/type';

import { ShaderPropertyType, ShaderProperty } from '../operation/property';

declare const cce: any;

export const shaderNodeMap: Map<string, NodeDefine> = new Map();
export const shaderPropertyMap: Map<string, PropertyDefine> = new Map();
export const shaderNodeClassMap: Map<string, typeof ShaderNode | typeof ShaderProperty> = new Map();

/**
 * 转换成 dump 数据
 * @param options
 */

export function register(options: IRegisterOptions) {
    return function(sclass: typeof ShaderNode) {
        const nodeCls = new sclass();
        const extend = Object.getPrototypeOf(nodeCls.constructor).name;
        const nodeDefine = {
            type: nodeCls.type,
            extend: extend,
            details: options,
            node: nodeCls.data,
        };

        const node = nodeDefine.node;
        if (nodeCls.type === 'PropertyNode') {
            collectShaderProperty(nodeCls.type);
        }

        shaderNodeClassMap.set(nodeCls.type, sclass);
        shaderNodeMap.set(nodeCls.type, nodeDefine);
    };
}

/**
 * 收集 ShaderProperty 类型
 * @param declareType - 实际需要创建的 Block 类型
 */
function collectShaderProperty(declareType: string) {
    // 收集 property
    shaderPropertyMap.clear();
    for (const key in ShaderPropertyType) {
        const type = ShaderPropertyType[key as ShaderPropertyType];
        if (typeof type === 'string') {
            const shaderProperty = new ShaderProperty(type);
            shaderProperty.type = type;
            shaderPropertyMap.set(type, {
                type: type,
                declareType: declareType,
                name: shaderProperty.name,
                outputs: shaderProperty.outputs,
                default: shaderProperty.value,
                details: shaderProperty.details,
            });
        }
    }
}

