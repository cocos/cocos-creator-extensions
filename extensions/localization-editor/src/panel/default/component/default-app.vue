<template>
    <Suspense>
        <template #default>
            <div>
                <DefaultMask v-show="!isLocalizationEditorEnable" @confirm="onMaskConfirm()"></DefaultMask>
                <Home
                    v-show="tabIndex === 0"
                    @translate="onTranslateClick"
                    @toggle="onToggle"></Home>
                <Translate
                    v-if="tabIndex === 1"
                    :target-locale="targetLocale"
                    @home="onHomeClick"
                    @initialized="onTranslateInitialized"
                >
                </Translate>

                <div v-show="showMask" class="mask">
                    <div class="mask-bg">
                        <ui-label
                            :value="`i18n:${MainName}.loading_tips`"
                        ></ui-label>
                        <ui-loading></ui-loading>
                    </div>
                </div>
            </div>
        </template>
        <template #fallback>
            <div class="fallback">
                <ui-loading></ui-loading>
            </div>
        </template>
    </Suspense>
</template>

<script lang="ts">
import 'reflect-metadata';
import HOME from './panel/default-home.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import Translate from './panel/default-translate.vue';
import { CustomError } from '../../../lib/core/error/Errors';
import { container } from 'tsyringe';
import EventBusService from '../../../lib/core/service/util/EventBusService';
import DefaultMask from './panel/default-mask.vue';
import WrapperMainIPC from '../../../lib/core/ipc/WrapperMainIPC';
import { MainName } from '../../../lib/core/service/util/global';

const eventBus = container.resolve(EventBusService);
const wrapper = container.resolve(WrapperMainIPC);
export default {
    components: {
        Home: HOME,
        Translate,
        DefaultMask,
    },
    setup() {
        onMounted(() => {
            eventBus.on('onCustomError', onError);
        });
        onUnmounted(() => {
            eventBus.off('onCustomError', onError);
        });
        const isLocalizationEditorEnable = ref(true);

        const showMask = ref(false);
        const targetLocale = ref('');
        const tabIndex = ref(0);
        function onError(customError: CustomError) {
            Editor.Dialog.error(customError.message, {
                buttons: [Editor.I18n.t(MainName + '.confirm')],
            });
            console.error(customError);
        }
        wrapper.getEnable().then((r) => {
            isLocalizationEditorEnable.value = r;
        });
        return {
            MainName,
            async onToggle(enable: boolean){
                isLocalizationEditorEnable.value = enable;
            },
            async onMaskConfirm(){
                isLocalizationEditorEnable.value = await wrapper.toggle();
            },
            isLocalizationEditorEnable,
            tabIndex,
            targetLocale,
            showMask,
            onTranslateClick(language: string) {
                targetLocale.value = language;
                tabIndex.value = 1;
                showMask.value = true;
            },
            onTranslateInitialized() {
                showMask.value = false;
            },
            onHomeClick() {
                eventBus.emit('updateAllLanguageConfig');
                tabIndex.value = 0;
            },
        };
    },
};
</script>
<style></style>