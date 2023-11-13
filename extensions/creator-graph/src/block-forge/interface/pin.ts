
/*
 * 序列化需要的数据
 */

// Pin 的序列化数据
export interface PinData<V = any, D extends Object = {[key: string]: any;}> {
    dataType: string;
    value: V;
    details: D;
}

/**
 * 运行时数据
 */

/**
 * 注册时的定义
 */

// 在注册 Block 定义的时候描述的 Pin 数据
export interface IPinDescription<V = any, D extends Object = {[key: string]: any;}> {
    // 参数名，必须唯一
    tag: string;
    // 数据类型
    dataType: string;
    // 显示在界面上的 title
    name?: string;
    // 鼠标移动到界面上弹出的提示
    tooltip?: string;
    // 数据的值
    value?: V;
    // 显示的图标
    icon?: string;
    // 隐藏输入输出的针脚
    hidePin?: boolean;
    details: D;
}
