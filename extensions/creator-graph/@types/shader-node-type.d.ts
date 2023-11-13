/**
 * 该 type 是 shader node 那边类型定义，用于给 shader graph 使用
 */
import type { Color, Texture2D, TextureCube, Vec2, Vec3, Vec4 } from "cc";
import type { IBlockFeature, IBlockStyle } from "../src/block-forge/interface";

export type SlotDefaultValueType = Boolean | Vec4 | Vec3 | Vec2 | Number | Color | String | Texture2D | TextureCube | null;
export type SlotOrPropType = 'number' | 'float' | 'color' | 'vec4' | 'vec3' | 'vec2' | 'boolean' | 'string' | 'texture2D' | 'textureCube' | 'enum' | 'dynamicEnum';
export type SlotConnectType = 'vector' | 'texture2D' | 'textureCube' | 'boolean' | 'string' | 'color';

/**
 * 该类型动态搜集指定 shader node 的指定属性 key
 */
export type RegisterEnum = {
    /**
     * 需要收集 Shader Node
     */
    type: string;
    /**
     * 需要搜集 Shader Node 中执行属性的 key
     */
    property: string;
}

declare class SlotDefine {
    display: string;
    default: SlotDefaultValueType;
    type: SlotOrPropType;
    connectType: SlotConnectType;
    enum?: { [key: string]: any };
    registerEnumType?: string;
    registerEnum?: RegisterEnum;
}

export interface IRegisterOptions {
    menu?: string;
    title?: string;
    style?: { [key: string]: any }
    // 是否是主节点
    master?: boolean;
}

declare interface INodeDataDefine {
    inputs?: SlotDefine[];
    outputs?: SlotDefine[];
    props?: SlotDefine[];
}

export declare class NodeDefine {
    type: string;
    extend?: string;
    node: INodeDataDefine;
    details?: { [key: string]: any } & IRegisterOptions;
}

export type PropertyValueType = Vec2 | Vec3 | Vec4 | number | boolean | Color | Texture2D | TextureCube;

/**
 * Property Dump 数据
 */
export declare class PropertyDefine {
    name: string;
    type: string;
    // 实际对应的 block 类型
    declareType: string;
    default: PropertyValueType;
    outputs: SlotDefine[];
    details: {
        menu: string,
        style?: IBlockStyle,
        feature?: IBlockFeature,
        [key: string]: any
    };
}
