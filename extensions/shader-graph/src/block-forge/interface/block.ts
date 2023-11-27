import type { PinData, IPinDescription } from './pin';

/*
 * 序列化需要的数据
 */

// Block 的序列化数据
export interface BlockData<
    D extends Object = {
        [key: string]: any;
        inputDescription?: IPinDescription[];
        inputPins?: PinData[];
        outputDescription?: IPinDescription[];
        outputPins?: PinData[];
    }
> {
    type: string;
    position: { x: number, y: number };
    details: D;
}

/**
 * 注册时的定义
 */

// Block 数据格式
export interface IBlockDescription {
    type: string;
    // 名称
    title: string;
    extend?: string;
    feature?: IBlockFeature;
    style?: IBlockStyle;

    inputPins: (IPinDescription)[];
    createDynamicInputPins?(blockDesc: IBlockDescription, details: { [key: string]: any }): (IPinDescription)[];
    outputPins: (IPinDescription)[];
    createDynamicOutputPins?(blockDesc: IBlockDescription, details: { [key: string]: any }): (IPinDescription)[];
}

// Block 上可配置的数据
export interface IBlockFeature {

    //// -- 节点功能开关 --
    // 是否折叠
    isCollapsedBlock?: boolean;
    // 显示快速连接点
    showQuickConnectPoint?: boolean;
    // 显示图标
    icon?: string;
    // 标题按钮 --
    titleBtn?: string;
    // 已经注册事件 --
    eventHandlerCount?: number;
    // 引脚是否可见 --
    pinVisibility?: boolean;

    // 关联变量？？ --
    variable?: boolean;
    // 支持重命名 --
    supportsRename?: boolean;
    // 是否可删除 --
    deletable?: boolean;
    // 是否可以最小化 --
    supportsMinimization?: boolean;
}

export interface IBlockStyle {
    //// -- 节点样式控制 --

    // 背景颜色
    backgroundColor?: string;
    backgroundHoverColor?: string;
    backgroundActiveColor?: string;
    // header 颜色
    headerColor?: string;
    headerHoverColor?: string;
    headerActiveColor?: string;
    // 边框颜色
    borderColor?: string;
    borderHoverColor?: string;
    borderActiveColor?: string;
    // 文字颜色
    fontColor?: string;
    fontHoverColor?: string;
    // 阴影颜色
    shadowColor?: string;
    shadowHoverColor?: string;
    shadowActiveColor?: string;
    // 辅助色
    secondaryColor?: string;
    secondaryHoverColor?: string;
    secondaryActiveColor?: string;
    // 图标颜色
    iconColor?: string;
    iconHoverColor?: string;
    iconActiveColor?: string;
}
