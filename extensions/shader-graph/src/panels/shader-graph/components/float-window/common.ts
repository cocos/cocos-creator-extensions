import { nextTick, onMounted, ref, watch } from 'vue/dist/vue.js';
import { SetupContext } from 'vue/types/v3-setup-context';

import { HTMLGraphForgeElement } from '../../../../block-forge';
import BaseFloatWindow from './base';
import { FloatWindowConfig } from './internal';

export const commonEmits = [
    'hide',
];

export const commonProps = {
    forge: {
        type: HTMLGraphForgeElement,
        required: true,
        default: null,
    },
    config: {
        type: Object as () => FloatWindowConfig,
        required: true,
        default: null,
    },
};

export const commonLogic = (props: { forge: HTMLGraphForgeElement, config: FloatWindowConfig }, ctx: SetupContext | SetupContext<any>) => {
    const floatWindowRef = ref<typeof BaseFloatWindow>();
    const headerTitle = ref('');

    const hide = () => {
        floatWindowRef.value?.hide();
    };

    const isShow = () => {
        return floatWindowRef.value?.isShow;
    };

    const show = (position?: { top?: string; right?: string; left?: string; bottom?: string; }) => {
        floatWindowRef.value?.show(position);
    };

    const getRect = () => {
        const floatWindow = floatWindowRef.value!;
        return {
            x: parseInt(floatWindow.$el.style.left) || 0,
            y: parseInt(floatWindow.$el.style.top) || 0,
            width: parseInt(floatWindow.$el.style.width),
            height: parseInt(floatWindow.$el.style.height),
        };
    };

    const onClickHide = () => {
        hide();
    };

    function syncBase() {
        const base = props.config.base;
        headerTitle.value = base.title;
    }

    watch(() => props.config.base, () => {
        syncBase();
    });

    onMounted(() => {
        nextTick(() => {
            syncBase();
        });
    });

    function onSizeChanged() {

    }

    function onShow() {

    }

    function onHide() {
        ctx.emit('hide', props.config.key);
    }

    return {
        floatWindowRef,
        headerTitle,

        isShow,

        show,
        hide,
        onClickHide,
        getRect,

        onShow,
        onHide,
        onSizeChanged,
    };
};

export const commonTemplate = (config: { css?: string, header?: string, section?: string, footer?: string }) => {
    return `
      <BaseFloatWindow
          ref="floatWindowRef"
          :forge="forge"
          :config="config"
          class="${config.css}"
          @show="onShow"
          @hide="onHide"
          @size-changed="onSizeChanged"
      >
        <template v-if="${config.header !== undefined}" #header>
          ${config.header}
        </template>
        <template v-else #header>
           <div class="title">
              <ui-label :value=headerTitle></ui-label>
           </div>
           <ui-icon class="hide-button" value="collapse-right" @click="onClickHide"></ui-icon>
        </template>
        
        <template #section>
          ${config.section}
        </template>
        <template #footer>
          ${config.footer}
        </template>
      </BaseFloatWindow>
    `;
};
