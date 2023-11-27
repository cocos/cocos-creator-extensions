'use strict';

module.exports = {
    description: 'shader graph',

    title: 'Shader Graph',

    buttons: {
        open: 'Open',
        new: 'New',
        save: 'Save',
        save_as: 'Save as',
        unsaved: 'Do not Save',
        cancel: 'Cancel',
        reset: 'Reset',
        ok: 'Ok',
        load: 'Load',
        override: 'Override',
        saveAndReload: 'Save & Load',
    },

    messages: {
        titles: {
            normal: 'Information',
            warning: 'Warning',
            open: 'Open Shader Graph',
        },
        reset: {
            detail: 'Are you sure to ignore all unsaved changes, revert to previous saved version?',
        },
        save: {
            title: 'Save Shader Graph Asset',
            detail: 'Are you sure to save current updates？',
        },
        scene_ready: {
            mask_tips: 'Waiting for scene loading...',
        },
        wait_load: {
            mask_tips: 'Waiting for loading...',
        },
        // The source file has changed for the current Shader Graph editing. It might result unexpected conflicts. Do you want to Load or Override
        assets_change: {
            mask_tips: 'The source file has changed for the current Shader Graph editing. It might result unexpected conflicts. Do you want to ',
        },
        // There is no Shader Graph to Edit. Do you want to Create and Open or Open
        need_create_new_asset: {
            mask_tips: 'There is no Shader Graph to Edit. Do you want to ',
        },
        // The original Shader Graph asset source file has lost. Do you want to Create and Open or Save as and Open
        missing_assets: {
            detail: 'The original Shader Graph asset source file has lost. Do you want to save again?',
            mask_tips: 'The original Shader Graph asset file has lost. Do you want to ',
        },
        save_and_reload_by_rename: {
            mask_tips: 'Shader Graph asset name has been changed, you need to save the current operation and reload it ',
        },
    },

    menu: {
        import: 'Shader Graph',
        name: 'Shader Graph',
        open: 'Open',
    },

    right_menu: {
        create_node: 'Create Node',
        paste: 'Paste',
        delete: 'Delete',
        copy: 'Copy',
        cut: 'Cut',
        duplicate: 'Duplicate',
        convert_to_variable: 'Convert to Variable',
        expand_group_node: 'Expand Group Node',
        create_subgraph_from_selection: 'Create Subgraph from Selection',
        create_group_from_selection: 'Create Group from Selection',
        create_annotation_for_selection: 'Create Annotation for Selection',
        zoom_to_fit: 'Zoom to Fit',
        reset: 'Reset',
    },

    graph_property: {
        menu_name: 'Variables',
        title: 'Graph Variables',
        add: 'Add Variables',
        delete: 'Delete Variable',
    },

    create_node: {
        title: 'Create Node',
        menu_name: 'Create Node',
        close: {
            tooltip: 'Close Create Node Window',
        },
        search_input: {
            placeholder: 'Search Node Names',
        },
    },

    preview: {
        title: 'Preview',
        menu_name: 'Preview',
        mesh: 'Mesh',
        close: {
            tooltip: 'Close Preview Window',
        },
    },

    custom_nodes: {
        menu_name: 'Custom Nodes',
        title: 'Custom Nodes',
    },
};
