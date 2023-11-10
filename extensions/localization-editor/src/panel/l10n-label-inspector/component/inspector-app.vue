<template>
    <div class="i18nComponent" @blur="onBlur">
        <div
            v-if="isShow"
            ref="searchRoot"
            class="search"
            tabindex="0"
            @blur="onBlur">
            <m-input
                ref="input"
                v-model="search"
                @focus="onFocus"
                @blur="onBlur">
            </m-input>
            <m-container
                :container-height="200"
                :current="refNewKey"
                :items="filterList"
                :item-height="38"
                tabindex="0"
                @focus="onFocus"
                @blur="onBlur">
                <template #default="listItem">
                    <ui-prop
                        class="item"
                        tabindex="0"
                        :select="listItem.item.key === refNewKey"
                        @mousedown="onCommit(listItem.item)"
                    >
                        <div class="container" style="height: 22px">
                            <ui-label
                                class="strongWhite"
                                value="value:"
                                style="line-height: 16px"></ui-label>
                            <ui-label
                                v-show="listItem.item.value"
                                :value="listItem.item.value"
                                style="line-height: 22px; font-size: 14px">
                            </ui-label>
                            <ui-label
                                v-show="!listItem.item.value"
                                class="strongWhite"
                                :value="`i18n:${MainName}.label_inspector.no_origin`"
                                style="line-height: 22px; font-size: 14px"></ui-label>
                        </div>
                        <div class="container">
                            <ui-label
                                class="strongWhite"
                                style="line-height: 16px"
                                :value="`i18n:${MainName}.label_inspector.key:`"></ui-label>
                            <ui-label
                                class="strongWhite"
                                style="line-height: 16px"
                                :value="listItem.item.key"></ui-label>
                            <ui-icon value='check' class="strongWhite" v-if="listItem.item.key === refDefaultKey"></ui-icon>
                        </div>
                    </ui-prop>
                </template>
            </m-container>
        </div>
        <div ref="uiProps" @focus="onBlur"></div>

        <ui-prop
            v-show="!isMulti"
            id="keyProp"
            :tooltip="errorTooltip"
            @focus="onBlur">
            <ui-label slot="label" value="Key" :tooltip="`i18n:${MainName}.component.key`"></ui-label>
            <div slot="content">
                <m-input
                    :model-value="refNewKey"
                    :error="!!errorTooltip"
                    :disabled="isDisabledInputKey"
                    @update:modelValue="onUpdateKey">
                    <div class="container">
                        <m-icon value="select" :disabled="isDisabledInputKey" @click="onClick"></m-icon>
                        <m-icon value="reset" :disabled="isDisabledInputKey" @click="onChangeKeyClick"></m-icon>
                    </div>
                </m-input>
            </div>
            <ui-prop class="btn-edit-group">
                <div slot="content" class="btn-edit-content">
                    <ui-button
                        :disabled="saveButtonDisabled || isDisabledInputKey"
                        @confirm="confirmResetKey">
                        <ui-label
                            color
                            i18n
                            :value="btnSaveText"></ui-label>
                    </ui-button>
                    <ui-button
                        class="margin-left-4"
                        :disabled="resetButtonDisabled || isDisabledInputKey"
                        @confirm="onResetKey">
                        <ui-label
                            color
                            i18n
                            :value="btnResetText"></ui-label>
                    </ui-button>
                    <ui-button
                        class="margin-left-4"
                        @confirm="onOpenI10nEditor"
                    >
                        <ui-label
                            color
                            :value="`i18n:${MainName}.label_inspector.edit`"></ui-label>
                    </ui-button>
                </div>
            </ui-prop>
            <ui-label class="red" :value="errorTooltip" ></ui-label>
        </ui-prop>
        <ui-prop v-show="isMulti">
            <ui-label slot="label" value="Key"></ui-label>
            <ui-input slot="content" disabled="true"></ui-input>
        </ui-prop>
    </div>
</template>

<script lang="ts">
import mInput from '../../share/ui/m-input.vue';
import mIcon from '../../share/ui/m-icon.vue';
import mContainer from '../../share/ui/m-container.vue';
import WrapperMainIPC from '../../../lib/core/ipc/WrapperMainIPC';
import EventBusService from '../../../lib/core/service/util/EventBusService';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type IAssociation from '../../../lib/core/entity/translate/IAssociation';
import type IWrapperTranslateItem from '../../../lib/core/entity/translate/IWrapperTranslateItem';
import TranslateItemType from '../../../lib/core/entity/translate/TranslateItemType';
import { MainName } from '../../../lib/core/service/util/global';
import { container } from 'tsyringe';

const wrapper = container.resolve(WrapperMainIPC);
const eventBus = container.resolve(EventBusService);
type Dump = {
    value: Record<string, { value: Dump | any; values?: any | Dump[]; visible: boolean; readonly: boolean }>;
};
type UIProp = HTMLElement & {
    render(dump: any): void;
    dump: Dump;
};
export default {
    components: { mInput, mIcon, mContainer},
    setup() {
        const isSaving = ref(false);
        const isDisabledInputKey = computed(() => {
          return isSaving.value === true;
        });
        const btnResetText = ref(`${MainName}.label_inspector.reset`);
        const btnSaveText = ref(`${MainName}.label_inspector.save`);

        const isMulti = computed((): boolean => {
            return refDump.value?.value.node?.values?.length > 1;
        });
        const sceneUuid = ref('');
        async function updateSceneUUID(){
            sceneUuid.value = await Editor.Message.request('scene', 'query-current-scene');
        }

        const association = computed((): IAssociation => {
            return {
                sceneUuid: sceneUuid.value,
                nodeUuid: refDump.value?.value.node.value.uuid,
                reference: sceneUuid.value,
            };
        });
        const search = ref('');
        /** 文本列表 */
        const list = ref([] as IWrapperTranslateItem[]);
        /** 资源列表 */
        const fileList = ref([] as IWrapperTranslateItem[]);

        /** 获取错误的提示 */
        function getErrorTip(key: string) {
            if (!key) {
                return Editor.I18n.t(MainName + '.label_inspector.cannot_empty');
            }
            if (!key.match(/^[0-9a-zA-Z_@/+-|.]{1,}$/g)) {
                return Editor.I18n.t(MainName + '.label_inspector.error_tooltip');
            }
            if (fileList.value.some((it) => it.key === key)) {
                return Editor.I18n.t(MainName + '.label_inspector.exist_media_tooltip');
            }
            return '';
        }
        const isShow = ref(false);
        /** 提示框 */
        const errorTooltip = ref('');
        const input = ref(null as null | HTMLInputElement);
        /** 隐藏元素的计时器 */
        let hideTimeout: null | NodeJS.Timeout = null; // eslint-disable-line no-undef

        /** 更新渲染的数据 */
        async function updateList() {
            const translateData = await wrapper.getTranslateData();
            list.value = translateData.filter((item) => item.type !== TranslateItemType.Media);
            fileList.value = translateData.filter((item) => item.type === TranslateItemType.Media);
        }
        async function onClick() {
            isShow.value = true;
            search.value = '';
            await updateList();
            requestAnimationFrame(() => {
                input.value?.focus();
            });
        }
        const refDump = ref(null as null | Dump);
        const filterList = computed(() => {
            return Object.values(list.value).filter((item: IWrapperTranslateItem) => {
                return search.value === '' || item.key.includes(search.value) || item.value.includes(search.value);
            });
        });
        const uiProps = ref(null as null | UIProp);
        function emitChangeDump() {
            const event = new Event('change-dump', { bubbles: true, cancelable: true });
            uiProps.value?.dispatchEvent(event);
        }
        function onCommit(item: IWrapperTranslateItem) {
            resetKey(item.key);
            isShow.value = false;
        }
        const refNewKey = ref('');
        const refDefaultKey = computed(() => refDump.value?.value.key.value);
        async function confirmResetKey() {
            isSaving.value = true;
            const showSaveTextTimeoutID = setTimeout(() => {
                // 如果大于一秒的话，按钮显示保存中
                btnSaveText.value = `${MainName}.label_inspector.saving`;
            }, 1000)
            try {
                await updateSceneUUID();
                const original = refDump.value?.value.key.value;
                if (original) {
                    await wrapper.removeAssociation(original, association.value);
                }
                await wrapper.addAssociation(refNewKey.value, association.value);
                refDump.value!.value.key.value = refNewKey.value;
                emitChangeDump();
                wrapper.setDirty(false);
            } catch (e) {}
            clearTimeout(showSaveTextTimeoutID);
            btnSaveText.value = `${MainName}.label_inspector.save`;
            isSaving.value = false;
        }

        function onResetKey() {
            onUpdateKey(refDump.value!.value.key.value);
            wrapper.setDirty(false);
        }

        async function onOpenI10nEditor() {
          Editor.Panel.open(MainName);
        }

        /**
         * 重新设置 Key
         * 如果 key 不存在则调用编辑器接口重新建一个
         */
        async function resetKey(newKey?: string) {
            let tempUUID = '';
            if (newKey === undefined) {
                while (getErrorTip(tempUUID)) {
                    tempUUID = Editor.Utils.UUID.generate();
                }
            }
            newKey ??= tempUUID;
            refNewKey.value = newKey;
            wrapper.setDirty(true);
        }

        /** 修改这个 key */
        function onChangeKeyClick() {
            resetKey();
        }

        // 检查是否需要更新，排除 node 属性的变化
        function checkIfUpdatable(dump: Dump, cacheDump: Dump | null) {
            if (!cacheDump) return true;
            const obj1 = Object.assign({}, dump.value);
            const obj2 = Object.assign({}, cacheDump.value || {});
            delete obj1.node;
            delete obj2.node;
            return JSON.stringify(obj1) !== JSON.stringify(obj2);
        }

        async function onUpdate(dump: Dump) {
            if (!checkIfUpdatable(dump, refDump.value)) return;

            refDump.value = dump;
            refNewKey.value = dump.value.key.value;
            await updateList();
            if (uiProps.value) {
                uiProps.value.dump = dump;
                for (const [key, value] of Object.entries(dump.value)) {
                    let element: UIProp | null = uiProps.value.querySelector(`ui-prop[key=${key}]`);
                    if (element) {
                        element.hidden = !value.visible;
                    }
                    if (value.visible) {
                        if (key === 'key') {
                            continue;
                        } else {
                            if (!element) {
                                element = document.createElement('ui-prop') as UIProp;
                                element.setAttribute('key', key);
                                element.setAttribute('type', 'dump');
                                uiProps.value.appendChild(element);
                            }
                            element.render(value);
                        }
                    }
                }
            }
        }
        function onError(error: Error) {
            console.error(error);
        }
        onMounted(() => {
            eventBus.on('onCustomError', onError);
            eventBus.on('onDumpUpdated', onUpdate);
        });
        onUnmounted(() => {
            eventBus.off('onCustomError', onError);
            eventBus.off('onDumpUpdated', onUpdate);
        });
        function onFocus() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
        }
        function onBlur(event?: FocusEvent) {
            hideTimeout = setTimeout(() => {
                isShow.value = false;
            }, 200);
        }

        function onUpdateKey(key: string) {
            errorTooltip.value = getErrorTip(key);
            refNewKey.value = key;
            resetKey(key);
        }
        const resetButtonDisabled = computed(() => {
            return refNewKey.value === refDump.value?.value.key.value;
        });
        const saveButtonDisabled = computed(() => {
            const isDisabled = refNewKey.value === refDump.value?.value.key.value || errorTooltip.value !== '';
            return isDisabled;
        });
        const searchRoot = ref(null as HTMLElement | null);
        return {
            searchRoot,
            saveButtonDisabled,
            resetButtonDisabled,
            MainName,
            isShow,
            errorTooltip,
            refNewKey,
            refDefaultKey,
            isMulti,
            onFocus,
            onUpdateKey,
            input,
            refDump,
            uiProps,
            list,
            onCommit,
            search,
            onClick,
            onBlur,
            filterList,
            onChangeKeyClick,
            confirmResetKey,
            onResetKey,

            isDisabledInputKey,
            btnSaveText,
            btnResetText,

            onOpenI10nEditor,
        };
    },
};
</script>
