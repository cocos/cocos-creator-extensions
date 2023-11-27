export enum FloatWindowDragTarget {
    // 自身
    itself = 0,
    // 头部
    header = 1,
}

export type FloatWindowEventOptions = {
    /**
     * 是否可以缩放窗口
     */
    resizer: boolean;
    enableAspectRatio?: boolean;
    /**
     * 是否可以拖动
     */
    drag: boolean;
    /**
     * 无限制
     */
    limitless?: boolean;
    /**
     * 拖动什么元素可移动
     */
    target: FloatWindowDragTarget,
}

export type FloatWindowTab = {
        name: string;
        show: boolean;
        height?: number;
        width?: number;
}

export type FloatWindowConfig = {
    dontSave?: boolean;
    key: string;
    tab: FloatWindowTab;
    base: {
        defaultShow: boolean;
        title: string;
        minWidth: string;
        minHeight: string;
        width?: string,
        height?: string,
    };
    position: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
    };
    events: FloatWindowEventOptions;
    details?: { [key: string]: any };
}
