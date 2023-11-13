import { useDragEvent } from './header';
import { adjustWindowPosition, useResizer } from './resizer';
import { HTMLGraphForgeElement } from '../../../../../block-forge';
import { FloatWindowConfig, FloatWindowDragTarget } from '../internal';

import { defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue/dist/vue.js';
import { setMinSize } from './const';
import { MessageMgr, MessageType } from '../../../../../shader-graph';

export default defineComponent({
    name: 'BaseFloatWindow',

    props: {
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
    },

    emits: [
        'hide',
        'show',
        'size-changed',
    ],

    setup(props, ctx) {
        const isShow = ref(false);
        const floatWindowRef = ref();
        const headerRef = ref();

        function syncPosition(rect: { top?: string; right?: string; left?: string; bottom?: string; }) {
            if (rect.top !== undefined) {
                floatWindowRef.value.style.top = rect.top;
            } else {
                floatWindowRef.value.style.top = '';
            }
            if (rect.left !== undefined) {
                floatWindowRef.value.style.left = rect.left;
            } else {
                floatWindowRef.value.style.left = '';
            }
            if (rect.right !== undefined) {
                floatWindowRef.value.style.right = rect.right;
            } else {
                floatWindowRef.value.style.right = '';
            }
            if (rect.bottom !== undefined) {
                floatWindowRef.value.style.bottom = rect.bottom;
            } else {
                floatWindowRef.value.style.bottom = '';
            }
        }

        function hide() {
            isShow.value = false;
            floatWindowRef.value?.setAttribute('hidden', '');
            ctx.emit('hide');
        }

        function show(position?: { top?: string; right?: string; left?: string; bottom?: string; }) {
            syncPosition(position || props.config.position);

            if (isShow.value) return;
            isShow.value = true;

            nextTick(() => {
                onResize();
                floatWindowRef.value?.removeAttribute('hidden');
                ctx.emit('show');
            });
        }

        function syncConfig() {
            if (!floatWindowRef.value || !props.forge) return;

            syncBase();
            syncEvents();
        }

        function syncBase() {
            const base = props.config.base;
            const details = props.config.details;
            floatWindowRef.value.style.height = details?.height || base.height;
            floatWindowRef.value.style.width = details?.width || base.width;

            setMinSize(parseFloat(base.minWidth), parseFloat(base.minHeight));

            nextTick(() => {
                onResize();
            });
        }

        function syncEvents() {
            let target: HTMLDivElement;
            if (props.config.events.target === FloatWindowDragTarget.header) {
                target = headerRef.value;
            } else {
                target = floatWindowRef.value;
            }
            useDragEvent({
                config: props.config,
                $window: floatWindowRef.value,
                target: target,
                onChange: () => {},
            });

            useResizer({
                config: props.config,
                $window: floatWindowRef.value,
                onChange: () => {
                    ctx.emit('size-changed');
                },
            });
        }

        watch(() => props.config.events, () => {
            syncEvents();
        });
        watch(() => props.config.base, () => {
            syncBase();
        });

        function onResize() {
            if (isShow.value) {
                adjustWindowPosition(floatWindowRef.value, props.forge);
            }
        }

        onMounted(() => {
            MessageMgr.Instance.register(MessageType.Resize, onResize);

            nextTick(() => {
                syncConfig();
            });
        });

        onUnmounted(() => {
            MessageMgr.Instance.unregister(MessageType.Resize, onResize);
        });

        return {
            floatWindowRef,
            headerRef,

            hide,
            show,
            syncConfig,
            onResize,

            isShow,
        };
    },

    template: `
    <div ref="floatWindowRef" class="float-window" hidden>
      <div ref="headerRef" class="header">
        <slot name="header"></slot>
      </div>
      <div class="section">
        <slot name="section"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
        `,
});
