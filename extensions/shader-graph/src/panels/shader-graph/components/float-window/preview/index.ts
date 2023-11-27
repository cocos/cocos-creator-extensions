import { merge, debounce } from 'lodash';
import { defineComponent, ref } from 'vue/dist/vue.js';

import BaseFloatWindow from '../base';
import { commonEmits, commonLogic, commonProps, commonTemplate } from '../common';
import { FloatWindowConfig, FloatWindowDragTarget } from '../internal';
import { GraphDataMgr, MessageMgr, GraphConfigMgr, MessageType, GraphAssetMgr } from '../../../../../shader-graph';
import { PreviewConfig } from '../../../../../contributions/internal';
import { validatePosition } from '../utils';

const BOX_MESH = '1263d74c-8167-4928-91a6-4e2672411f47@a804a';

export const DefaultConfig: FloatWindowConfig = {
    key: 'preview',
    tab: {
        name: 'i18n:shader-graph.preview.menu_name',
        show: true,
        height: 80,
    },
    base: {
        title: 'i18n:shader-graph.preview.title',
        width: '223px',
        height: '228px',
        minWidth: '223px',
        minHeight: '228px',
        defaultShow: false,
    },
    position: {
        right: '28px',
        bottom: '0',
    },
    events: {
        resizer: true,
        drag: true,
        enableAspectRatio: true,
        target: FloatWindowDragTarget.header,
    },
    details: {
        primitive: BOX_MESH,
        lightEnable: true,
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

    emits: [...commonEmits],

    setup(props, ctx) {
        const common = commonLogic(props, ctx);
        const glPreview = ref();
        const initPreviewDone = ref(false);
        const initGL = ref(false);
        const previewDirty = ref(true);
        const loading = ref(true);
        const animationId = ref(-1);
        const lightRef = ref<HTMLElement>();
        const previewCanvas = ref();
        const previewConfig = ref<PreviewConfig>({
            primitive: '',
            lightEnable: false,
        });

        async function callPreview(funcName: string, ...args: any[]) {
            if (!initPreviewDone.value) return;
            await Editor.Message.request('scene', 'call-preview-function', 'shader-graph-preview', funcName, ...args);
            previewDirty.value = true;
        }

        async function updateConfigToPreview(config: PreviewConfig) {
            await callPreview('setLightEnable', config.lightEnable);
            await callPreview('setPrimitive', config.primitive);
        }

        async function updateMaterial() {
            if (!initPreviewDone.value || !common.isShow()) return;

            loading.value = true;
            await MessageMgr.Instance.callSceneMethod('updateMaterial', [GraphDataMgr.Instance.getCurrentGraphData()]);
            loading.value = false;
            previewDirty.value = true;
        }

        const aspectRatio = -1;
        async function refreshPreview() {
            if (previewDirty.value) {
                previewDirty.value = false;

                const canvas = previewCanvas.value;
                if (!canvas) return;

                const width = canvas.clientWidth === 0 ? canvas.parentNode.clientWidth : canvas.clientWidth;
                const height = width;

                // 等比缩放
                if (canvas.width !== width || !initGL.value) {
                    initGL.value = true;
                    await glPreview.value.initGL(canvas, { width, height });
                    await glPreview.value.resizeGL(width, height);
                }
                const data = await glPreview.value.queryPreviewData({
                    width,
                    height: height,
                });
                glPreview.value.drawGL(data);
            }

            cancelAnimationFrame(animationId.value);
            animationId.value = requestAnimationFrame(() => {
                refreshPreview();
            });
        }

        async function onMouseDownOnCanvas(event: MouseEvent) {
            await callPreview('onMouseDown', { x: event.x, y: event.y, button: event.button });

            async function mousemove(event: MouseEvent) {
                await callPreview('onMouseMove', {
                    movementX: event.movementX,
                    movementY: event.movementY,
                });
            }

            async function mouseup(event: MouseEvent) {
                await callPreview('onMouseUp', {
                    x: event.x,
                    y: event.y,
                });

                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', mouseup);

                previewDirty.value = false;
            }
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
        }

        async function onMouseWheelOnCanvas(event: WheelEvent) {
            const scale = event.deltaY * 0.01;
            await callPreview('setZoom', scale);
        }

        function addEventListenerToCanvas() {
            const canvas = previewCanvas.value;
            canvas.addEventListener('mousedown', onMouseDownOnCanvas);
            canvas.addEventListener('mousewheel', onMouseWheelOnCanvas);
        }

        function removeEventListenerToCanvas() {
            const canvas = previewCanvas.value;
            canvas.removeEventListener('mousedown', onMouseDownOnCanvas);
            canvas.removeEventListener('mousewheel', onMouseWheelOnCanvas);
        }

        const onSizeChangedDebounced = debounce(() => {
            if (!common.isShow()) return;

            initPreview().then(() => {
                previewDirty.value = true;
            });
        }, 50);

        common.onSizeChanged = () => {
            onSizeChangedDebounced();
        };

        const onPreviewChangeDebounced = debounce(async (dirty: boolean, type?: string) => {
            if (!common.isShow()) return;

            if (dirty && type !== 'position-changed') {
                await initPreview();
                await updateMaterial();
            }
        }, 50);

        async function onInitPreview() {
            if (!common.isShow() || !GraphAssetMgr.Instance.uuid) return;

            await initPreview();
            const { primitive, lightEnable } = props.config.details!;
            if (previewConfig.value.primitive !== primitive ||
                previewConfig.value.lightEnable !== lightEnable) {
                previewConfig.value = {
                    primitive: primitive || BOX_MESH,
                    lightEnable: lightEnable,
                };
                applyPreviewConfigToUI();
            }
            await updateMaterial();
        }

        MessageMgr.Instance.register(MessageType.SceneReady, onInitPreview);
        MessageMgr.Instance.register(MessageType.SetGraphDataToForge, onInitPreview);
        MessageMgr.Instance.register(MessageType.DirtyChanged, onPreviewChangeDebounced);

        async function initPreview(force = false) {
            if (!initPreviewDone.value || force) {
                initPreviewDone.value = true;
                await MessageMgr.Instance.callSceneMethod('initPreview', [previewConfig.value]);
                // @ts-expect-error
                const GlPreview = Editor._Module.require('PreviewExtends').default;
                glPreview.value = new GlPreview('shader-graph-preview', 'query-shader-graph-preview-data');
                glPreview.value.init({
                    width: previewCanvas.value.clientWidth,
                    height: previewCanvas.value.clientHeight,
                });
                addEventListenerToCanvas();
                refreshPreview();
            }
        }

        common.onShow = async () => {
            if (await MessageMgr.Instance.checkSceneReady()) {
                await onInitPreview();
            }
        };

        function reset() {
            initPreviewDone.value = false;
            initGL.value = false;
            removeEventListenerToCanvas();
            cancelAnimationFrame(animationId.value);
        }

        const commonHide = common.hide;
        common.hide = async () => {
            commonHide();
            reset();
            await GraphConfigMgr.Instance.autoSave();
        };

        const commonShow = common.show;
        common.show = async (position?: { top?: string; right?: string; left?: string; bottom?: string }) => {
            if (!validatePosition(position)) {
                const config = GraphConfigMgr.Instance.getFloatingWindowConfigByName(DefaultConfig.key);
                position = validatePosition(config?.position) ? config?.position : DefaultConfig.position;
            }
            commonShow(position);
        };

        async function onClose() {
            common.hide();
        }

        async function onRefresh() {
            reset();
            initGL.value = false;
            await initPreview(true);
            await updateMaterial();
        }

        function applyPreviewConfigToUI() {
            onLightChange(previewConfig.value.lightEnable, false);
        }

        function onLightChange(enabled: boolean, save = true) {
            if (enabled) {
                lightRef.value?.setAttribute('pressed', '');
            } else {
                lightRef.value?.removeAttribute('pressed');
            }

            const { primitive } = previewConfig.value;
            previewConfig.value = {
                primitive: primitive,
                lightEnable: enabled,
            };
            updateConfigToPreview(previewConfig.value);
            if (save) {
                GraphConfigMgr.Instance.saveDetails(DefaultConfig.key, previewConfig.value);
            }
        }

        function onPrimitiveChange(event: CustomEvent) {
            callPreview('resetCamera');
            const target = event.target as HTMLInputElement;
            const { lightEnable } = previewConfig.value;
            previewConfig.value = {
                primitive: target.value,
                lightEnable: lightEnable,
            };
            updateConfigToPreview(previewConfig.value);
            GraphConfigMgr.Instance.saveDetails(DefaultConfig.key, previewConfig.value);
        }

        return {
            ...common,

            previewCanvas,
            previewConfig,

            loading,

            onClose,
            onRefresh,

            lightRef,

            onLightChange,
            onPrimitiveChange,
        };
    },

    template: commonTemplate({
        css: 'preview',
        header: `
<ui-label class="title-label" value="i18n:shader-graph.preview.title"></ui-label>
<ui-icon class="close" transparent
  tooltip="i18n:shader-graph.preview.close.tooltip"
  value="collapse-right"
  @click="onClose"
></ui-icon>
        `,
        section: `
            <canvas ref="previewCanvas"></canvas>
            <ui-loading class="loading" v-show="loading"></ui-loading>
            <div class="tools">
              <ui-icon class="light"
                ref="lightRef"
                value="spot-light"
                @mousedown.stop="onLightChange(previewConfig.lightEnable=!previewConfig.lightEnable)"
              ></ui-icon>
              <ui-icon
                type="icon"
                class="refresh"
                value="refresh"
                @mousedown.stop="onRefresh" 
              ></ui-icon>
            </div>
            <div class="primitive-group">
                <ui-label slot="label" value="i18n:shader-graph.preview.mesh"></ui-label>
                <ui-asset slot="content" droppable="cc.Mesh" 
                    :value="previewConfig.primitive"
                    @change.stop="onPrimitiveChange"
                ></ui-asset>
            </div>
        `,
        footer: ``,
    }),
});
