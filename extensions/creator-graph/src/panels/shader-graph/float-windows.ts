import { SetupContext } from 'vue/types/v3-setup-context';
import { ref, onMounted, onUnmounted } from 'vue/dist/vue.js';

import {
    FloatWindow,
    FloatWindowConfig,
    FloatWindowTab,
    getFloatWindowMap,
    updateFloatWindowConfigs,
} from './components/float-window';
import { GraphConfigMgr, MessageMgr, MessageType } from '../../shader-graph';
import { nextTick } from 'vue';

export const floatWindowsLogic = (props: { }, ctx: SetupContext | SetupContext<any>) => {
    const tabRefs = ref<HTMLElement[]>([]);
    const floatWindowRefs = ref<typeof FloatWindow[]>([]);
    const pressTabRefs: Map<string, HTMLElement> = new Map();
    const floatWindowMap = getFloatWindowMap();
    const floatWindowConfigList = ref<FloatWindowConfig[]>([]);

    function onFloatWindowConfigChanged() {
        updateFloatWindowConfigs().then((configs: FloatWindowConfig[]) => {
            floatWindowConfigList.value = configs;
        });
    }

    MessageMgr.Instance.register(MessageType.AssetLoaded, () => {
        initFloatWindowConfigs();
    });

    onMounted(() => {
        MessageMgr.Instance.register([
            MessageType.FloatWindowConfigChanged,
        ], onFloatWindowConfigChanged);
    });

    onUnmounted(() => {
        MessageMgr.Instance.unregister([
            MessageType.FloatWindowConfigChanged,
        ], onFloatWindowConfigChanged);
    });

    function getFloatWindowByKey(key: string) {
        return floatWindowMap.get(key) ?? undefined;
    }

    function initFloatWindowConfigs() {
        updateFloatWindowConfigs().then((configs: FloatWindowConfig[]) => {
            floatWindowConfigList.value = configs;

            nextTick(() => {
                floatWindowRefs.value.forEach((floatWindowRef) => {
                    GraphConfigMgr.Instance.addFloatWindow(floatWindowRef.config.key, floatWindowRef.$el);
                });
                floatWindowConfigList.value.forEach((config, index) => {
                    if (config.base.defaultShow || config.details?.show) {
                        pressTab(tabRefs.value[index], floatWindowRefs.value[index], config.key);
                    } else {
                        releaseTab(floatWindowRefs.value[index]);
                    }
                });
            });
        });
    }

    function pressTab(tabRef: HTMLElement, floatWindowRef: typeof FloatWindow, key: string) {
        if (tabRef && floatWindowRef) {
            floatWindowRef.show();
            pressTabRefs.set(key, tabRef);
            tabRef.setAttribute('pressed', '');
        }
    }

    function releaseTab(floatWindowRef: typeof FloatWindow) {
        floatWindowRef.hide();
        onHideFloatWindow(floatWindowRef.config.key);
    }

    ///// 右边 tab 菜单
    function togglePressTab(key: string, index: number) {
        // 当前按下的 tab
        const tabRef = tabRefs.value[index];
        const floatWindowRef = floatWindowRefs.value[index];
        if (tabRef && floatWindowRef) {
            if (tabRef.getAttribute('pressed') !== null) {
                releaseTab(floatWindowRef);
            } else {
                pressTab(tabRef, floatWindowRef, key);
            }
        }
    }

    function getStyle(tab: FloatWindowTab) {
        const style: Record<string, string> = {};
        if (tab.height !== undefined) {
            style.height = tab.height + 'px';
        }
        return style;
    }

    function onHideFloatWindow(key: string) {
        const tabRef = pressTabRefs.get(key);
        if (tabRef) {
            tabRef.removeAttribute('pressed');
            pressTabRefs.delete(key);
        }
    }
    /////

    return {
        tabRefs,
        floatWindowRefs,
        floatWindowConfigList,

        onHideFloatWindow,
        togglePressTab,
        getFloatWindowByKey,

        getStyle,
    };
};
