import type { GraphData } from './graph';

/*
 * 序列化需要的数据
 */

// Forge 的序列化数据
export interface ForgeData<D extends Object = {[key: string]: any;}> {
    graph: {
        [uuid: string]: GraphData;
    };
    details: D;
}

/**
 * 注册时的定义
 */
