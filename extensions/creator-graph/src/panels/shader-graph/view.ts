import { defineComponent, onMounted, onUnmounted, ref } from 'vue/dist/vue.js';

import { HTMLGraphForgeElement } from '../../block-forge';
import { maskLogic } from './mask';
import { floatWindowsLogic } from './float-windows';
import {
    GraphEditorMgr,
    GraphDataMgr,
    ForgeMgr,
    MessageMgr,
    GraphAssetMgr,
    MessageType,
    GraphConfigMgr,
} from '../../shader-graph';

export default defineComponent({

    props: {

    },

    setup(props, ctx) {
        // 遮罩逻辑
        const mask = maskLogic(props, ctx);
        const floatWindows = floatWindowsLogic(props, ctx);

        const showCreateNewMenu = ref(false);
        const dirtyRef = ref<HTMLDivElement>();
        const shaderGraphRef = ref<HTMLElement>();
        const forgeRef = ref<HTMLGraphForgeElement>();
        const foregroundRef = ref<HTMLElement>();
        const dragAreaRef = ref<HTMLElement>();

        function onDirty(dirty: boolean) {
            if (dirty) {
                dirtyRef.value?.removeAttribute('hidden');
            } else {
                dirtyRef.value?.setAttribute('hidden', '');
            }
        }

        onMounted( () => {
            MessageMgr.Instance.register(MessageType.DirtyChanged, onDirty);
            MessageMgr.Instance.register(MessageType.DraggingProperty, onDrag);
            if (forgeRef.value && shaderGraphRef.value) {

                const resizeObserver = new ResizeObserver(entries => {
                    // 在尺寸变化时执行的回调函数
                    entries.forEach(entry => {
                        if (entry.target === forgeRef.value) {
                            MessageMgr.Instance.send(MessageType.Resize);
                        }
                    });
                });
                // 将 ResizeObserver 添加到要观察的元素上
                resizeObserver.observe(forgeRef.value);

                GraphEditorMgr.Instance.setGraphForge(forgeRef.value);
                // 用于获取鼠标的坐标
                GraphEditorMgr.Instance.addMousePointerListener(shaderGraphRef.value);
                GraphDataMgr.Instance.setGraphForge(forgeRef.value);
                GraphConfigMgr.Instance.setGraphForge(forgeRef.value);
                ForgeMgr.Instance.setGraphForge(forgeRef.value);
            }

            GraphAssetMgr.Instance.openAsset();
        });

        onUnmounted(() => {
            MessageMgr.Instance.unregister(MessageType.DirtyChanged, onDirty);
            MessageMgr.Instance.unregister(MessageType.DraggingProperty, onDrag);
        });

        function onReset() {
            GraphDataMgr.Instance.restore();
        }

        function onSave() {
            GraphAssetMgr.Instance.save();
        }

        function onDrag() {
            foregroundRef.value?.removeAttribute('disallowed-event');
            dragAreaRef.value?.removeAttribute('disallowed-event');
        }

        function onDragEnd(event: DragEvent) {
            foregroundRef.value?.setAttribute('disallowed-event', '');
            dragAreaRef.value?.setAttribute('disallowed-event', '');
            const value = event.dataTransfer?.getData('value');
            const options = value && JSON.parse(value);
            if (options) {
                const { x, y } = GraphEditorMgr.Instance.convertsMousePoint(event.x, event.y - 28);
                options.x = x;
                options.y = y;
                GraphEditorMgr.Instance.add(options);
            }
        }

        function onChangeCreateNewMenu(show: boolean) {
            showCreateNewMenu.value = show;
        }

        return {
            dirtyRef,
            forgeRef,
            foregroundRef,
            dragAreaRef,
            shaderGraphRef,

            onReset,
            onSave,

            onDragEnd,

            showCreateNewMenu,
            onChangeCreateNewMenu,

            ...mask,
            ...floatWindows,
        };
    },
});
