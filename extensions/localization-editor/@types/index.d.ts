///<reference types="F:/Github/creator/app/@types/editor"/>
///<reference types="../../../../app/@types/editor"/>

interface CCENodeEventMap {
    added (node: import('cc').Node): void
    change (node: import('cc').Node): void
    removed (node: import('cc').Node): void
}

interface CCEComponentEventMap {
    added (component: import('cc').Component): void,
    removed (component: import('cc').Component): void,
}

declare class CCENodeManager extends EventEmitter {
    on<T extends keyof CCENodeEventMap> (message: T, callback: CCENodeEventMap[T]): this;
    off<T extends keyof CCENodeEventMap> (message: T, callback: CCENodeEventMap[T]): this;
}
declare class CCEComponentManager extends EventEmitter {
    on<T extends keyof CCEComponentEventMap> (message: T, callback: CCEComponentEventMap[T]): this;
    off<T extends keyof CCEComponentEventMap> (message: T, callback: CCEComponentEventMap[T]): this;
}

type CCE = {
    Node: CCENodeManager,
    Component: CCEComponentManager,
    Prefab: {
        /**
         * {
         *    prefabData: string;
         *    clearedReference: any;
         * } - 3.8.0 的返回值
         * @param nodeUUID
         */
        generatePrefabDataFromNode(nodeUUID: string| cc.Node): string | null | {
            prefabData: string;
            clearedReference: any;
        }
    }
};

declare const cce: CCE;
declare type UnPromise<T> = T extends Promise<infer R> ? R : T;
declare type UUID = string;
declare type Dump = { value: Record<string, { value: Dump | any, values?: any | Dump[], visible: boolean, readonly: boolean }> };
declare module 'cc/env' {
    export const EDITOR: boolean;
    export const BUILD: boolean;
}
declare const EditorExtends: any;

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// 告诉编译器 less 在 import 后得到的是字符串
declare module '*.less'{
    export default '';
}

declare type MapKey<T> = T extends Map<infer K, any> ? K : T;
declare type MapValue<T> = T extends Map<any, infer K> ? K : T;
declare type UUID = string;
