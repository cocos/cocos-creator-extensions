import { defineComponent } from 'vue/dist/vue.js';

import { merge } from 'lodash';
import BaseFloatWindow from '../base';
import { commonEmits, commonLogic, commonProps, commonTemplate } from '../common';
import { FloatWindowConfig, FloatWindowDragTarget } from '../internal';
import { GraphConfigMgr } from '../../../../../shader-graph';

export const DefaultConfig: FloatWindowConfig = {
    key: 'custom-nodes',
    tab: {
        name: 'i18n:shader-graph.custom_nodes.menu_name',
        show: false,
    },
    base: {
        title: 'i18n:shader-graph.custom_nodes.title',
        minWidth: '240px',
        minHeight: '240px',
        defaultShow: false,
    },
    position: {
        right: '0',
        top: '360',
    },
    events: {
        resizer: true,
        drag: true,
        target: FloatWindowDragTarget.header,
    },
};

export function getConfig() {
    const newConfig = JSON.parse(JSON.stringify(DefaultConfig));
    const config = GraphConfigMgr.Instance.getFloatingWindowConfigByName(DefaultConfig.key);
    if (config) {
        newConfig.details = merge({}, newConfig.details, config);
    }
    return newConfig;
}

export const component = defineComponent({

    components: {
        BaseFloatWindow,
    },

    props: {
        ...commonProps,
    },

    emits: [
        ...commonEmits,
    ],

    setup(props, ctx) {
        return {
            ...commonLogic(props, ctx),

        };
    },

    template: commonTemplate({
        section: `
        
        `,
        footer: `
        
        `,
    }),
});

