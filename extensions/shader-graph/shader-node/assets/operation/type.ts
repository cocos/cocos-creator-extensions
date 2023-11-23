import { Vec2, Vec3, Vec4, ccenum, Color, Texture2D, TextureCube } from 'cc';
import { IBlockFeature, IBlockStyle } from '../../../src/block-forge/interface';

export enum ConcretePrecisionType {
    Min,
    Max,
    Fixed,
    Texture,
}
(ConcretePrecisionType as any)._name = 'ConcretePrecisionType';

export enum TextureConcretePrecision {
    Texture2D = 100,
    TextureCube = 101,
}
(TextureConcretePrecision as any)._name = 'TextureConcretePrecision';

export enum PositionSpace {
    Local = 0,
    View,
    World,
    // Tangent,
    // AbsoluteWorld
}
(PositionSpace as any)._name = 'PositionSpace';

export enum NormalSpace {
    Local = 0,
    View,
    World,
    // Tangent,
}
(NormalSpace as any)._name = 'NormalSpace';

export enum ViewDirSpace {
    Local = 0,
    View,
    World,
    // Tangent,
}
(ViewDirSpace as any)._name = 'ViewDirSpace';

export const NormalMapSpace = 300;

export interface IRegisterOptions {
    menu?: string;
    title?: string;
    // 节点的样式
    style?: IBlockStyle;
    // 是否是主节点
    master?: boolean;
}

export interface INodeDataDefine {
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

export type SlotDefaultValueType = Boolean | Vec4 | Vec3 | Vec2 | Number | Color | String | Texture2D | TextureCube | null;
// 如果类型是 any，会走动态定义 slot 类型
export type SlotOrPropType = 'any' | 'number' | 'float' | 'color' | 'vec4' | 'vec3' | 'vec2' | 'boolean' | 'string' | 'texture2D' | 'textureCube' | 'enum' | 'dynamicEnum';
export type SlotConnectType = 'any' | 'vector' | 'texture2D' | 'textureCube' | 'boolean' | 'string' | 'color';

/**
 * 该类型动态搜集指定 shader node 的指定属性 key
 */
export type RegisterEnum = {
    /**
     * 枚举类型
     */
    type: string;
    /**
     * 需要搜集 Shader Node 中指定属性
     */
    property: string;
}

export interface SlotPropDetail {
    enum?: any;
    /**
     * 为了识别是否把 slot 注册到 enum 上
     */
    registerEnumType?: string;
    /**
     * 获取注册 enum 信息
     */
    registerEnum?: RegisterEnum;
}

export declare class SlotDefine {
    display: string;
    default: SlotDefaultValueType;
    type: SlotOrPropType;
    connectType: SlotConnectType;
}
export declare class PropDefine {
    display: string;
    default: Vec4 | Vec3 | Vec2 | Number | String;
    type: string; //'Number' | 'Texture' | 'Enum'
    enum: any;
}
