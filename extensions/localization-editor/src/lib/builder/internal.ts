import { IBuildPluginConfig } from '@cocos/creator-types/editor/packages/builder/@types';
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';


export interface IInternalBuildPluginConfig extends IBuildPluginConfig {
    hooks?: string; // 钩子函数的存储路径
    panel?: string; // 存储导出 vue 组件、button 配置的脚本路径
}

export interface BuilderAssetCache {
    addInstance: (instance: any) => void;
    getDependUuids: (uuid: string) => Promise<readonly string[]>;
    getAssetInfo: (uuid: string) => AssetInfo;
    getInstance: (uuid: string) => Promise<any>;
}

export interface InternalBuildResult {
    bundles: IBundle[];
}

export interface IBundle {
    removeAsset(asset: string): void;
}
