'use strict';

module.exports = {
    description: '材质编辑器',

    title: 'Shader Graph',

    buttons: {
        open: '打开',
        new: '新建',
        save: '保存',
        save_as: '另存为',
        unsaved: '不保存',
        cancel: '取消',
        reset: '重置',
        ok: '确定',
        load: '加载',
        override: '覆盖',
        saveAndReload: '保存并加载',
    },

    messages: {
        titles: {
            normal: '温馨提示',
            warning: '警告',
            open: '打开 Shader Graph',
        },
        reset: {
            detail: '是否撤回当前所有操作，还原到上一次修改？',
        },
        save: {
            title: '保存 Shader Graph 资源',
            detail: '是否保存当前所有操作？',
        },
        scene_ready: {
            mask_tips: '等待场景加载完成...',
        },
        wait_load: {
            mask_tips: '等待加载完成...',
        },
        // 当前编辑的 Shader Graph 源文件发生变化，可能会发生冲突，需要重新 加载 或者 覆盖
        assets_change: {
            mask_tips: '当前编辑的 Shader Graph 源文件发生变化，可能会发生冲突，请处理是否需要重新 ',
        },
        // 目前没有 Shader Graph 可编辑，是否 新建并打开 或 打开
        need_create_new_asset: {
            mask_tips: '目前没有 Shader Graph 可编辑，是否 ',
        },
        // 检查到当前 Shader Graph 的原始资源文件丢失，需要重新 新建并打开 或 另存为并打开
        missing_assets: {
            detail: '原始 Shader Graph 资源文件已经丢失，是否重新保存?',
            mask_tips: '检查到当前 Shader Graph 的原始资源文件丢失，需要 ',
        },
        save_and_reload_by_rename: {
            mask_tips: '资源名已变更，需要保存当前操作并重新加载 ',
        },
    },

    menu: {
        import: 'Shader Graph',
        name: 'Shader Graph',
        open: '打开',
    },

    right_menu: {
        create_node: '创建节点',
        paste: '粘贴',
        delete: '删除',
        copy: '拷贝',
        cut: '剪切',
        duplicate: '生成副本',
        convert_to_variable: '转换为变量',
        expand_group_node: '展开组节点',
        create_subgraph_from_selection: '为选中创建子图',
        create_group_from_selection: '为选中创建组节点',
        create_annotation_for_selection: '为选中创建标注',
        zoom_to_fit: '缩放至合适位置',
        reset: '复位',
    },

    graph_property: {
        menu_name: '变量',
        title: '变量',
        add: '添加变量',
        delete: '删除变量',
    },

    create_node: {
        title: '创建节点',
        menu_name: '创建节点',
        close: {
            tooltip: '关闭创建节点窗口',
        },
        search_input: {
            placeholder: '搜索名称',
        },
    },

    preview: {
        title: '预览',
        menu_name: '预览',
        mesh: '网格',
        close: {
            tooltip: '关闭预览窗口',
        },
    },

    custom_nodes: {
        menu_name: 'Custom Nodes',
        title: 'Custom Nodes',
    },
};
