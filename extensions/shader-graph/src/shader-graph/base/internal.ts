import { INodeDetails } from '../interface';
import { BlockData, LineData } from '../../block-forge/interface';

export enum MaskType {
    None = 0,
    /**
     * 等待加载
     */
    WaitLoad = 1,
    /**
     * 资源发生变化的时候
     */
    AssetChange = 10,
    /**
     * 资源丢失
     */
    AssetMissing = 30,
    /**
     * 没有选择 shader graph 时，需要提示用户去创建
     */
    NeedCreateNewAsset = 50,
    /**
     * 是否需要保存并重新加载
     */
    NeedSaveBeReloadByRename = 51,
    /**
     * 等待场景加载完成
     */
    WaitSceneReady = 100,
}

/**
 * 用于添加 block 属性
 */
export interface GraphEditorAddOptions {
    uuid?: string;
    type: string;
    x?: number;
    y?: number;
    dontConvertPos?: boolean;
    details: INodeDetails;
}

/**
 * 其他存储数据例如拷贝，粘贴
 */
export interface GraphEditorOtherOptions {
    uuid: string;
    lineData?: LineData;
    blockData?: BlockData;
}

export enum MessageType {

    // --- assets ---
    AssetLoaded = 'asset-loaded',

    SceneReady = 'scene-ready',
    SceneClose = 'scene-closed',

    EnterGraph = 'enter-graph',

    SetGraphDataToForge = 'set-graph-data-to-forge',
    Restore = 'restore',
    Loaded = 'load-completed',
    Declared = 'declare-completed',
    Dirty = 'dirty',
    DirtyChanged = 'dirty-changed',
    DraggingProperty = 'dragging-property',

    // mask
    UpdateMask = 'update-mask',

    // menu
    ShowCreateNodeWindow = 'show-create-node',
    CreateMenuChange = 'create-menu-change',

    // float window
    FloatWindowConfigChanged = 'float-window-config-changed',

    // window
    Resize = 'resize',
}

export interface IFloatWindowConfig {
    position?: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
    }

    show?: boolean;
    width?: string;
    height?: string;

    [key: string]: any;
}

export interface IFloatWindowConfigs {
    [name: string]: IFloatWindowConfig,
}

export interface IGraphConfig {
    offset: { x: number, y: number },
    scale: number,
    floatWindows: IFloatWindowConfigs,
}

export interface IGraphConfigs {
    [uuid: string]: IGraphConfig
}
