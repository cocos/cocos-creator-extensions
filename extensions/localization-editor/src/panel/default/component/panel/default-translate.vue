<template>
    <div class="translate">
        <head>
            <div class="toolbar container">
                <m-button @confirm="onHomeClick">
                    <ui-icon value="arrow-triangle" style="transform: rotate(90deg)"></ui-icon>
                </m-button>
                <m-button @confirm="onFileInputClick">
                    <ui-icon value="import"></ui-icon>
                    <ui-label
                        color
                        :value="`i18n:${MainName}.translate.import_file`">
                    </ui-label>
                </m-button>
                <!-- <m-button>
                    <ui-label color> 检查</ui-label>
                </m-button>
                <m-button>
                    <ui-label color> 修改字体</ui-label>
            </m-button>-->

                <m-button @confirm="onSaveClick">
                    <ui-icon style="display: inline-block; margin-right: 4px" :value="'save'"></ui-icon>
                    <ui-label
                        color
                        :value="`i18n:${MainName}.translate.save`">
                    </ui-label>
                </m-button>
            </div>
        </head>

        <body>
            <div class="tabs container">
                <div
                    class="tab"
                    :class="{ selected: currentTab === Tab[0] }"
                    @click="onTabClick(0)">
                    <ui-label
                        v-show="isSameLanguage"
                        color
                        :value="`i18n:${MainName}.translate.unfilled`">
                    </ui-label>
                    <ui-label
                        v-show="!isSameLanguage"
                        color
                        :value="`i18n:${MainName}.translate.untranslated`">
                    </ui-label>
                </div>
                <div
                    class="tab"
                    :class="{ selected: currentTab === Tab[1] }"
                    @click="onTabClick(1)">
                    <ui-label
                        v-show="isSameLanguage"
                        color
                        :value="`i18n:${MainName}.translate.filled`">
                    </ui-label>
                    <ui-label
                        v-show="!isSameLanguage"
                        color
                        :value="`i18n:${MainName}.translate.translated`">
                    </ui-label>
                </div>
                <div
                    class="tab"
                    :class="{ selected: currentTab === Tab[2] }"
                    @click="onTabClick(2)">
                    <ui-label
                        color
                        :value="`i18n:${MainName}.translate.import_tab_title`">
                    </ui-label>
                </div>
            </div>
            <div class="div">
                <div
                    ref="translateTable"
                    class="table"
                    tabindex="1"
                    :scrollTop="translateScrollTop"
                    @scroll="onTranslateScroll"
                    @click="isLockItem && clearSelected()">
                    <div class="tr head">
                        <div class="th">
                            <div tabindex="0">
                                <div class="container">
                                    <ui-label
                                        v-if="currentTab === 'imported' ||!isSameLanguage"
                                        class="weakWhite"
                                        :value="localPanelTranslateData!.displayName">
                                    </ui-label>
                                    <ui-label
                                        v-else-if="isSameLanguage"
                                        class="weakWhite"
                                        :value="`i18n:${MainName}.translate.key`">
                                    </ui-label>
                                </div>
                            </div>
                        </div>
                        <div class="th">
                            <div tabindex="0">
                                <div class="container">
                                    <ui-label
                                        v-if="currentTab === 'imported' || !isSameLanguage"
                                        class="weakWhite"
                                        :value="targetPanelTranslateData!.displayName">
                                    </ui-label>
                                    <ui-label
                                        v-else-if="isSameLanguage"
                                        class="weakWhite"
                                        :value="`i18n:${MainName}.translate.origin`">
                                    </ui-label>
                                </div>
                                <m-button
                                    v-show="!isSameLanguage && currentTab === Tab[0]"
                                    :color="'blue'"
                                    :disabled="!hasTranslateProvider"
                                    @confirm="onTranslateClick">
                                    <ui-label
                                        color
                                        :value="`i18n:${MainName}.translate.translate`">
                                    </ui-label>
                                </m-button>
                                <m-button
                                    v-show="currentTab === Tab[0] && !isSameLanguage"
                                    :color="'blue'"
                                    :disabled="!isTargetTranslateDataHasEmptyMedia"
                                    @confirm="onImportAllClick">
                                    <ui-label
                                        color
                                        :value="`i18n:${MainName}.translate.import_all`">
                                    </ui-label>
                                </m-button>
                            </div>
                        </div>
                    </div>
                    <div :style="{height:translateTotalHeight +'px',paddingTop:translatePaddingTop+'px'}">
                        <!-- 翻译数据 -->
                        <div
                            v-for="item of translateVisibleItems"
                            :key="item.key"
                            class="tr">
                            <!-- 翻译原文 -->
                            <div class="td" tabindex="0">
                                <div>
                                    <m-input
                                        style="flex: 1"
                                        :is-textarea="true"
                                        :model-value="getDisplayNameOfLocalItem(item.key)"
                                        :readonly="true"
                                        @click="onItemMouseDown(item, true)"
                                        @blur="onItemBlur"></m-input>
                                </div>
                            </div>
                            <!-- 翻译后的文案 -->
                            <div class="td">
                                <div class="container">
                                    <m-input
                                        :is-textarea="true"
                                        :model-value="getDisplayNameOfTargetItem(item.key)"
                                        :readonly="isSameLanguage && item.type === TranslateItemType.Media"
                                        @blur="onItemBlur"
                                        @click="onItemMouseDown(item, false)"
                                        @update:modelValue="onInputChanged(item.key, $event)">
                                        <m-button
                                            v-if="item.type === TranslateItemType.Media && !isSameLanguage"
                                            class="import"
                                            :color="'blue'"
                                            @confirm="onImportClick(item.key)">
                                            <ui-label
                                                color
                                                :value="`i18n:${MainName}.translate.import`">
                                            </ui-label>
                                        </m-button>
                                        <m-button
                                            v-if="item.type !== TranslateItemType.Media"
                                            :color="'blue'"
                                            :disabled="isVariantsDisable(item.key)"
                                            @confirm="onVariantsClick(item.key)">
                                            <ui-label
                                                color
                                                :value="`i18n:${MainName}.translate.variant`">
                                            </ui-label>
                                        </m-button>
                                    </m-input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        <footer tabindex="1" @mousedown="onCancelItemBlur">
            <div>
                <ui-label
                    class="weakWhite"
                    :value="`i18n:${MainName}.translate.key:`">
                </ui-label>

                <ui-label
                    class="selectable"
                    :value="currentSelectedItem?.key || ''">
                </ui-label>
            </div>
            <!-- <div class="container" v-if="currentSelectedItem">
                <ui-label>引用的场景的 uuid:</ui-label>
                <ui-label
                    v-for="item of positionInfoOfAssociation(currentSelectedItem, 'sceneUuid')"
                    :key="item.__key"
                    :value="item.value"
                >
                </ui-label>
        </div>-->
            <div>
                <ui-label
                    class="weakWhite"
                    :value="`i18n:${MainName}.translate.position:`">
                </ui-label>
                <ui-label
                    v-for="item of positionInfoOfAssociation"
                    :key="item.__key"
                    class="selectable link"
                    :value="item.value.path"
                    @click="onPositionInfoClick(item.value.uuid)">
                </ui-label>
            </div>
            <div>
                <ui-label
                    class="weakWhite"
                    :value="`i18n:${MainName}.translate.reference_uuid`">
                </ui-label>
                <ui-label
                    v-for="item of nodeUuidOfAssociation"
                    :key="item.__key"
                    class="selectable"
                    :value="item.value">
                </ui-label>
            </div>
        </footer>
        <div v-if="currentVariantsItem" class="variants">
            <div>
                <div class="header">
                    <ui-label :value="`i18n:${MainName}.translate.variant`"></ui-label>
                </div>

                <div class="body">
                    <div>
                        <div class="table" @click.stop>
                            <div class="tr">
                                <div class="th">
                                    <!-- 源语言 -->
                                    <div tabindex="0">
                                        <ui-label
                                            :value="`i18n:${MainName}.translate.standard`"
                                            class="weakWhite">
                                        </ui-label>
                                    </div>
                                </div>
                                <div class="th">
                                    <!-- 目标语言 -->
                                    <div tabindex="0" class="container">
                                        <ui-label
                                            :value="`i18n:${MainName}.translate.after_variant`"
                                            class="weakWhite"
                                            style="flex: 1"></ui-label>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-for="(item, index) of currentVariantsItem._variants"
                                :key="item.key"
                                class="tr">
                                <!-- 变体的左侧 -->
                                <div class="td">
                                    <div>
                                        <m-input :model-value="variantKeys[index]" :readonly="true"></m-input>
                                    </div>
                                </div>
                                <!-- 变体的数据 -->
                                <div class="td">
                                    <div class="container">
                                        <m-input v-model="item.value" :is-textarea="true"></m-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <div class="container">
                        <div style="flex: 1">
                            <m-button
                                :color="'blue'"
                                :disabled="isDeleteVariantsDisable"
                                @confirm="onVariantsDelete">
                                <ui-label
                                    color
                                    :value="`i18n:${MainName}.translate.delete_variant`">
                                </ui-label>
                            </m-button>
                        </div>
                        <div>
                            <m-button
                                :has-border="true"
                                @confirm="onVariantsCancel">
                                <ui-label
                                    color
                                    :value="`i18n:${MainName}.translate.cancel`">
                                </ui-label>
                            </m-button>
                            <m-button
                                :has-border="true"
                                style="margin-left: 16px"
                                @confirm="onVariantsConfirm">
                                <ui-label
                                    color
                                    :value="`i18n:${MainName}.translate.confirm`">
                                </ui-label>
                            </m-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="conflictItemsBetweenImportedFilesAndTranslatedFiles.length" class="dialog">
            <div class="content" style="width: 933px;min-width: 933px;min-height: 366px;max-height: 686px;">
                <div class="header">
                    <ui-label :value="`i18n:${MainName}.translate.save`"></ui-label>
                </div>
                <div class="body">
                    <ui-label :value="`i18n:${MainName}.translate.conflict_dialog_content`"></ui-label>
                    <div>
                        <div
                            ref="conflictTable"
                            class="table"
                            :style="{height:conflictContainerHeight+'px'}"
                            @scroll="onConflictScroll">
                            <div class="tr head">
                                <div class="th">
                                    <ui-checkbox
                                        :value="isConflictSelectAll"
                                        @change="onConflictItemSelectAllClick($event.target.value)"></ui-checkbox>
                                </div>
                                <div class="th">
                                    <ui-label
                                        class="weakWhite"
                                        :value="`i18n:${MainName}.translate.key`"></ui-label>
                                </div>
                                <div class="th">
                                    <ui-label
                                        class="weakWhite"
                                        :value="`i18n:${MainName}.translate.old_value`">
                                    </ui-label>
                                </div>
                                <div class="th">
                                    <ui-label
                                        class="weakWhite"
                                        :value="`i18n:${MainName}.translate.new_value`">
                                    </ui-label>
                                </div>
                            </div>
                            <div :style="{ paddingTop: conflictPaddingTop+'px', height: conflictTotalHeight + 'px' }">
                                <div
                                    v-for="(item, index) in conflictVisibleItems"
                                    :key="item.key"
                                    class="tr">
                                    <div class="td hideOverFlow">
                                        <ui-checkbox
                                            :value="selectedConflictItemIndexSet.has(index)"
                                            @change="onConflictItemClick($event.target.value, index)">
                                        </ui-checkbox>
                                    </div>
                                    <div class="td hideOverFlow">
                                        <ui-label
                                            :value="item.key"
                                            :tooltip="item.key">
                                        </ui-label>
                                    </div>
                                    <div class="td hideOverFlow">
                                        <ui-label
                                            :value="targetPanelTranslateData?.items[item.key]?.value ?? item.value"
                                            :tooltip="(targetPanelTranslateData?.items[item.key]?.value ?? item.value)">
                                        </ui-label>
                                    </div>
                                    <div class="td hideOverFlow">
                                        <ui-label
                                            :value="importedTranslateItemMap[item.key].value"
                                            :tooltip="importedTranslateItemMap[item.key].value">
                                        </ui-label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <m-button
                        :has-border="true"
                        :transparent="true"
                        :disabled="selectedConflictItemIndexSet.size === 0"
                        @confirm="onConflictConfirmClick">
                        <ui-label
                            color
                            :value="`i18n:${MainName}.translate.cover`"></ui-label>
                    </m-button>
                    <m-button
                        :has-border="true"
                        :transparent="true"
                        @confirm="onConflictCancelClick">
                        <ui-label
                            color
                            :value="`i18n:${MainName}.translate.cancel`"></ui-label>
                    </m-button>
                </div>
            </div>
        </div>

        <div
            v-show="isShowImportAll"
            class="dialog">
            <div class="content" style="width: 524px;height:272px;">
                <div class="header">
                    <ui-label :value="`i18n:${MainName}.translate.import_all`">
                    </ui-label>
                </div>
                <div class="body container">
                    <div>
                        <div class="container row">
                            <ui-label
                                :value="`i18n:${MainName}.translate.source_string`"
                                :style="{'min-width': isCN?'60px':'93px'}"></ui-label>
                            <m-input
                                v-model="importAllFrom"
                                :place-holder="`i18n:${MainName}.translate.source_string_placeholder`"
                                class="fill"></m-input>
                        </div>
                        <div class="container row">
                            <ui-label
                                :value="`i18n:${MainName}.translate.dist_string`"
                                :style="{'min-width': isCN?'60px':'93px'}"></ui-label>
                            <m-input
                                v-model="importAllTo"
                                class="fill"
                                :place-holder="`i18n:${MainName}.translate.dist_string_placeholder`"></m-input>
                        </div>
                    </div>
                </div>
                <div class="footer">
                    <m-button
                        :has-border="true"
                        :transparent="true"
                        @confirm="onImportAllConfirm">
                        <ui-label
                            color
                            :value="`i18n:${MainName}.translate.confirm`"></ui-label>
                    </m-button>
                    <m-button
                        :has-border="true"
                        :transparent="true"
                        @confirm="onImportAllCancel">
                        <ui-label
                            color
                            :value="`i18n:${MainName}.translate.cancel`"></ui-label>
                    </m-button>
                </div>
            </div>
        </div>

        <div v-show="saving" class="save-mask">
            <div class="mask-bg">
                <ui-label
                    :value="`i18n:${MainName}.translate.saving_tips`"></ui-label>
                <ui-loading></ui-loading>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { extname, join, relative } from 'path';
import 'reflect-metadata';
import { computed, ComputedRef, nextTick, onMounted, onUnmounted, Ref, ref } from 'vue';
import MButton from '../../../share/ui/m-button.vue';
import MInput from '../../../share/ui/m-input.vue';
import WrapperTranslateItem from '../../../../lib/core/entity/translate/WrapperTranslateItem';
import Iterator from '../../../share/scripts/Iterator';
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import IAssociation from '../../../../lib/core/entity/translate/IAssociation';
import IWrapperTranslateItem from '../../../../lib/core/entity/translate/IWrapperTranslateItem';
import TranslateItemType from '../../../../lib/core/entity/translate/TranslateItemType';
import { MainName, ProjectAssetPath } from '../../../../lib/core/service/util/global';
import { MergeTranslateItemOption, TranslateFileType } from '../../../../lib/core/type/type';
import ITranslateItem from '../../../../lib/core/entity/translate/ITranslateItem';
import { getTranslateFileType } from '../../../share/scripts/utils';
import { container } from 'tsyringe';
import WrapperMainIPC from '../../../../lib/core/ipc/WrapperMainIPC';
import { PanelTranslateData } from '../../../share/scripts/PanelTranslateData';
import { IPluralRulesJson } from '../../../../../@types/po';

const pluralRules: IPluralRulesJson = container.resolve('PluralRules');
const Tab = ['untranslated', 'translated', 'imported'] as const;
type SaveOption = { mergeOptions?: MergeTranslateItemOption, force?: boolean };

const wrapper = container.resolve(WrapperMainIPC);

// 这个组件是配置界面
export default {
    components: {
        'm-button': MButton,
        'm-input': MInput,
    },
    props: {
        /** 目标语言 */
        targetLocale: {
            type: String,
            required: true,
        },
    },
    emits: ['home', 'initialized'],
    async setup(props: { targetLocale: string }, { emit }) {
        const isCN = ref(Editor.I18n.getLanguage() === 'zh');
        function updateLanguage() {
            isCN.value = Editor.I18n.getLanguage() === 'zh';
        }
        onMounted(() => {
            const addBroadcastListener = Editor.Message.__protected__ ? Editor.Message.__protected__.addBroadcastListener : Editor.Message.addBroadcastListener;
            addBroadcastListener('i18n:change', updateLanguage);

        });
        onUnmounted(() => {
            const removeBroadcastListener = Editor.Message.__protected__ ? Editor.Message.__protected__.removeBroadcastListener : Editor.Message.removeBroadcastListener;
            removeBroadcastListener('i18n:change', updateLanguage);
        });

        const hasTranslateProvider = !!(await wrapper.getCurrentTranslateProvider());
        const isSameLanguage = computed((): boolean => {
            const result = localPanelTranslateData.value?.locale === props.targetLocale;
            return result;
        });
        const currentTranslateDataItems: ComputedRef<IWrapperTranslateItem[]> = computed(() => {
            if (currentTab.value === 'untranslated') {
                return untranslatedTranslateDataItems.value;
            }
            if (currentTab.value === 'translated') {
                return translatedTranslateDataItems.value;
            }
            if (currentTab.value === 'imported') {
                return Object.values(importedTranslateItemMap.value);
            }

            return [];
        });

        const indexData = await wrapper.getIndexData();

        /** 未翻译的数据 */
        const untranslatedTranslateDataItems = computed(() => {
            const targetDataItems = targetPanelTranslateData.value?.items ?? {};
            const localDataItems = localPanelTranslateData.value?.items ?? {};
            const targetDataItemsKeys = Object.keys(targetDataItems);
            if (isSameLanguage.value) {
                return Object.values(targetDataItems).filter((item) => item && !item.value)as IWrapperTranslateItem[];
            }
            return Object.keys(localDataItems)
                .filter((key) => !targetDataItemsKeys.includes(key) && localDataItems[key]?.value)
                .map((key) => localDataItems[key]) as IWrapperTranslateItem[];
        });

        /** 已翻译的数据 */
        const translatedTranslateDataItems = computed(() => {
            const targetDataItems = targetPanelTranslateData.value?.items ?? {};
            const localDataItems = localPanelTranslateData.value?.items ?? {};
            const targetDataItemsKeys = Object.keys(targetDataItems).reverse();
            if (isSameLanguage.value) {
                return Object.values(targetDataItems).filter((item) => item?.value)as IWrapperTranslateItem[];
            }
            return targetDataItemsKeys
                .filter((key) => localDataItems[key]?.value)
                .map((key) => localDataItems[key]) as IWrapperTranslateItem[];
        });
        // 要记录修改的内容，仅仅发送修改的内容给主进程
        const currentTab = ref('untranslated' as typeof Tab[number]);
        const changedTranslateItemMap = ref({} as Record<string, IWrapperTranslateItem | undefined>);
        function updateChangedTranslateItemMap(
            sourceItem: Readonly<IWrapperTranslateItem>,
            value: string,
            displayName?: string,
            assetInfo?: AssetInfo | null,
            variants?: IWrapperTranslateItem['_variants'],
            associations: IAssociation[] = [],
        ) {
            const item = (changedTranslateItemMap.value[sourceItem.key] ??= new WrapperTranslateItem(
                sourceItem.key,
                value,
                sourceItem.type,
                displayName,
                assetInfo,
                associations,
                variants,
            ));
            item.value = value;
            if (typeof displayName === 'string') {
                item.displayName = displayName;
            }
            if (assetInfo) {
                item.assetInfo = assetInfo;
            }
            if (variants) {
                item._variants = variants;
            }
            if (associations) {
                item.associations = associations;
            }
        }
        const currentVariantsItem = ref(null as IWrapperTranslateItem | null);
        /** 本地语言数据集 */
        const localPanelTranslateData = ref(await PanelTranslateData.getPanelTranslateData());
        async function updateLocalPanelTranslateData(){
            localPanelTranslateData.value = await PanelTranslateData.getPanelTranslateData();
        }
        function isDirty() {
            return Object.keys(changedTranslateItemMap.value).length;
        }

        const saving = ref(false);
        async function onSaveClick() {
            await save();
        }
        /** 通过这个变量控制是否为变体 */
        let replaceVariant = false;
        async function _doSave(items?: IWrapperTranslateItem[], options?: SaveOption) {
            options ??= {};
            options.mergeOptions ??= { replaceVariant };

            if (['untranslated', 'translated'].includes(currentTab.value)) {
                await saveInTranslate(items, options);
            } else {
                // 如果有未保存的部分先保存未保存的部分
                if (isDirty()) {
                    await saveInTranslate();
                }
                await saveInImportedFile(items, options);
            }
        }
        async function save(items?: IWrapperTranslateItem[], options?: SaveOption) {
            return new Promise((resolve, reject) => {
                saving.value = true;
                setTimeout(async () => {
                    await _doSave(items, options);
                    saving.value = false;
                    // 点击保存后需要立即刷新场景的显示效果
                    await wrapper.previewBy(props.targetLocale);
                    resolve(true);
                });
            });
        }
        /** 在翻译界面以及未翻译界面点击保存的回调 */
        async function saveInTranslate(items?: IWrapperTranslateItem[] | Record<string, IWrapperTranslateItem | undefined>, options?: SaveOption) {
            items ??= changedTranslateItemMap.value;
            console.debug('onSaveClick', items);
            if (items === changedTranslateItemMap.value) {
                changedTranslateItemMap.value = {};
            } else {
                if (items instanceof Array) {
                    for (let index = 0; index < items.length; index++) {
                        const item = items[index];
                        delete changedTranslateItemMap.value[item.key];
                    }
                }
            }
            replaceVariant = false;
            await wrapper.saveTranslateData(props.targetLocale, items, options?.mergeOptions);
            await updateTargetTranslateData();
        }
        /**
         * 导入的文件与翻译数据的冲突，这个数组一旦有内容，则会显示弹窗页面
         */
        const conflictItemsBetweenImportedFilesAndTranslatedFiles = ref([] as IWrapperTranslateItem[]);

        const selectedConflictItemIndexSet = ref(new Set<number>());

        function onConflictItemClick(value: boolean, index: number) {

            if (value) {
                selectedConflictItemIndexSet.value.add(index);
            } else {
                selectedConflictItemIndexSet.value.delete(index);
            }

        }
        const isConflictSelectAll = computed({
            get() {
                const length: number = conflictItemsBetweenImportedFilesAndTranslatedFiles.value.length;
                const set = selectedConflictItemIndexSet.value;
                return set.size === length;
            },
            set(value) {
                if (value) {
                    for (let index = 0; index < conflictItemsBetweenImportedFilesAndTranslatedFiles.value.length; index++) {
                        selectedConflictItemIndexSet.value.add(index);
                    }
                } else {
                    selectedConflictItemIndexSet.value.clear();
                }
            },
        });

        function onConflictItemSelectAllClick(value: boolean) {
            isConflictSelectAll.value = value;
        }
        function _saveImportedFile(items: IWrapperTranslateItem[], options?: SaveOption){
            wrapper.saveTranslateData(props.targetLocale, items, options?.mergeOptions).then((r) => {
                updateTargetTranslateData();
                updateLocalPanelTranslateData();
            });
            // 如果是在非本地语言导入则需要额外地往本地语言更新新的条目
            if (!isSameLanguage.value){
                const localTranslateItems = Object.values(localPanelTranslateData.value!.items);
                const newTranslateItems = items.filter(item => !localTranslateItems.some(it => it?.key === item.key));
                if (newTranslateItems.length){
                    wrapper.saveTranslateData(localPanelTranslateData.value!.bcp47Tag, newTranslateItems, options?.mergeOptions).then((r) => {
                        updateLocalPanelTranslateData();
                    });
                }
            }
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                delete importedTranslateItemMap.value[item.key];
            }
            replaceVariant = false;
        }
        async function saveInImportedFile(items?: IWrapperTranslateItem[], options?: SaveOption) {
            items ??= Object.values(importedTranslateItemMap.value);
            if (items) {
                const targetTranslateItems = Object.values(targetPanelTranslateData.value!.items);
                conflictItemsBetweenImportedFilesAndTranslatedFiles.value = items.filter(item => targetTranslateItems.some(it => it?.key === item!.key));
                conflictScrollTop.value = 0;
                const noConflictItems = items.filter(item => !targetTranslateItems.some(it => it?.key === item!.key));
                // 未冲突部分的处理
                if (noConflictItems.length){
                    _saveImportedFile(noConflictItems, options);
                }
                // 冲突部分的处理
                if (options?.force) {
                    _saveImportedFile(items, options);
                    selectedConflictItemIndexSet.value.clear();
                    conflictItemsBetweenImportedFilesAndTranslatedFiles.value = [];
                }
            }
        }
        const targetPanelTranslateData = ref(await PanelTranslateData.getPanelTranslateData(props.targetLocale));
        async function updateTargetTranslateData(translateResult?: readonly IWrapperTranslateItem[]) {
            if (translateResult) {
                console.debug('translateResult', translateResult);
                for (let index = 0; index < translateResult.length; index++) {
                    const item = translateResult[index];

                    const oldItem = changedTranslateItemMap.value[item.key] || targetPanelTranslateData.value!.items[item.key];
                    changedTranslateItemMap.value[item.key] = new WrapperTranslateItem(
                        item.key,
                        item.value,
                        item.type,
                        item.displayName ||
                        WrapperTranslateItem.getDisplayName({
                            item: item,
                            assetInfo: oldItem?.assetInfo || item.assetInfo,
                        }),
                        oldItem?.assetInfo,
                        item.associations,
                    );
                }
            } else {
                console.debug('update target translate data get translate data');
                targetPanelTranslateData.value = await PanelTranslateData.getPanelTranslateData(props.targetLocale);
            }
        }

        const variantKeys: Ref<Intl.LDMLPluralRule[]> = ref(pluralRules[targetPanelTranslateData.value!.bcp47Tag.split('-')[0]] ?? ['other'] as Intl.LDMLPluralRule[]);
        const currentSelectedItem = ref(null as IWrapperTranslateItem | null);
        const isTargetTranslateDataHasEmptyMedia = computed((): boolean => {
            const items = Object.values(localPanelTranslateData.value!.items).filter(
                (item) => item && item.type === TranslateItemType.Media,
            ) as Readonly<IWrapperTranslateItem[]>;
            if (items.length === 0) {
                return false;
            }

            for (const item of items) {
                const tempItem =
                    changedTranslateItemMap.value[item.key] ?? targetPanelTranslateData.value!.items[item.key];
                if (!tempItem?.value) {
                    return true;
                }
            }
            return false;
        });

        const blurTimeout = ref(null as NodeJS.Timeout | null); // eslint-disable-line no-undef
        /** 查询是否愿意清除 */
        async function executeCallbackWithOutDirty(callBack: Function): Promise<boolean> {
            if (isDirty()) {
                const cancel = 0;
                const result = await Editor.Dialog.info(Editor.I18n.t(MainName + '.translate.unsaved_warning'), {
                    buttons: [
                        Editor.I18n.t(MainName + '.translate.cancel'),
                        Editor.I18n.t(MainName + '.translate.confirm'),
                    ],
                    cancel,
                    default: 1,
                });
                if (result.response === cancel) {
                    return false;
                }
                await save(undefined, { force: true });
            }
            await callBack();
            return true;
        }
        function onItemMouseDown(item: InstanceType<typeof WrapperTranslateItem>, isLocalLanguage: boolean) {
            isLockItem.value = false;
            if (blurTimeout.value) {
                clearTimeout(blurTimeout.value);
            }
            if (isLocalLanguage) {
                currentSelectedItem.value = item;
            } else {
                if (currentTab.value === 'imported'){
                    currentSelectedItem.value = importedTranslateItemMap.value[item.key] ?? item;
                } else {
                    currentSelectedItem.value = changedTranslateItemMap.value[item.key] ?? targetPanelTranslateData.value?.items[item.key] ?? item;
                }
            }
        }
        const isLockItem = ref(false);
        function onCancelItemBlur() {
            isLockItem.value = true;
        }
        function onItemBlur() {
            if (!isLockItem.value){
                blurTimeout.value = setTimeout(() => {
                    clearSelected();
                }, 400);
            }
        }
        function clearSelected() {
            currentSelectedItem.value = null;
        }
        const importedTranslateItemMap = ref({} as Record<string, IWrapperTranslateItem>);
        const panelProfileKey = 'default-translate';
        const importFileProfileKey = `${panelProfileKey}.importFile`;
        async function getLastImportedFileProfile(): Promise<string> {
            return await Editor.Profile.getTemp(MainName, importFileProfileKey) || '';
        }
        function setLastImportedFileProfile(file: string) {
            Editor.Profile.setTemp(MainName, importFileProfileKey, file);
        }
        function onTabClick(index: number) {
            if (currentTab.value !== Tab[index]) {
                switch (index) {
                    case 0:
                    case 1:
                    case 2:
                        currentTab.value = Tab[index];
                        translateScrollTop.value = 0;
                        break;

                    default:
                        currentTab.value = Tab[0];
                        break;
                }
            }
        }
        async function onPositionInfoClick(uuid: string) {
            await Editor.Panel.focus('assets');
            Editor.Message.send('assets', 'twinkle', uuid, 'shake');
        }
        const isShowImportAll = ref(false);
        /** 智能导入时替换的源关键字 */
        const importAllFrom = ref(localPanelTranslateData.value!.locale);
        /** 智能导入时替换的结果 */
        const importAllTo = ref(props.targetLocale);

        // 本来此处应该可以使用 m-container 组件优化列表的，但是由于滚动条样式有特殊的产品需求，得自己实现优化列表
        /** 翻译条目的高度 */
        const translateItemHeight = 24;
        /** 视野内翻译条目 */
        const translateVisibleItems = computed(() => {
            const containerHeight = translateTable.value?.clientHeight ?? 0;
            const endIndex = Math.min(
                translateStartIndex.value + Math.ceil(containerHeight / translateItemHeight),
                currentTranslateDataItems.value.length
            );
            return currentTranslateDataItems.value.slice(translateStartIndex.value, endIndex);

        });
        /** 翻译表格中起始项 */
        const translateStartIndex = computed(() => Math.floor(translateScrollTop.value / translateItemHeight));
        /** 翻译表格中顶部的 Padding */
        const translatePaddingTop = computed(() => translateStartIndex.value * translateItemHeight);
        /** 翻译表格中滚动值，每次重新展示列表都要置零，否则会有显示错误 */
        const translateScrollTop = ref(0);
        /** 翻译表格中总高度 */
        const translateTotalHeight = computed(() => currentTranslateDataItems.value.length * translateItemHeight - translatePaddingTop.value);
        /** 翻译表格滚动得回调 */
        function onTranslateScroll(event: any) {
            translateScrollTop.value = event.target.scrollTop;
        }
        /** 翻译表格 */
        const translateTable = ref(null as HTMLElement| null);
        // 这里唯二的大量数据的表格，处理翻译于导入文件冲突的情况
        /** 冲突条目的高度 */
        const conflictItemHeight = 34;
        /** 冲突表格的高度 */
        const conflictContainerHeight = ref(460);
        /** 视野内冲突条目 */
        const conflictVisibleItems = computed(() => {
            const containerHeight = conflictContainerHeight.value;
            const endIndex = Math.min(
                conflictStartIndex.value + Math.ceil(containerHeight / conflictItemHeight),
                conflictItemsBetweenImportedFilesAndTranslatedFiles.value.length
            );
            return conflictItemsBetweenImportedFilesAndTranslatedFiles.value.slice(conflictStartIndex.value, endIndex);

        });
        /** 冲突表格中起始项 */
        const conflictStartIndex = computed(() => Math.floor(conflictScrollTop.value / conflictItemHeight));
        /** 冲突表格中顶部的 Padding */
        const conflictPaddingTop = computed(() => conflictStartIndex.value * conflictItemHeight);
        /** 冲突表格中滚动值，每次展示冲突列表都要置零，否则会有显示错误 */
        const conflictScrollTop = ref(0);
        /** 冲突表格中所有条目总高度 */
        const conflictTotalHeight = computed(() => {
            return Math.max(conflictItemsBetweenImportedFilesAndTranslatedFiles.value.length * conflictItemHeight - conflictPaddingTop.value, conflictContainerHeight.value);

        });
        /** 冲突表格滚动得回调 */
        function onConflictScroll(event: any) {
            conflictScrollTop.value = event.target.scrollTop;
        }
        const conflictTable = ref(null as HTMLElement | null);

        emit('initialized');
        /** 冲突表格 */
        return {
            conflictContainerHeight,
            conflictTable: conflictTable,
            conflictPaddingTop: conflictPaddingTop,
            conflictVisibleItems: conflictVisibleItems,
            onConflictScroll: onConflictScroll,
            conflictScrollTop: conflictScrollTop,
            conflictTotalHeight: conflictTotalHeight,
            translateTable: translateTable,
            translatePaddingTop: translatePaddingTop,
            translateVisibleItems: translateVisibleItems,
            onTranslateScroll: onTranslateScroll,
            translateScrollTop: translateScrollTop,
            translateTotalHeight: translateTotalHeight,
            isCN,
            importAllFrom,
            importAllTo,
            isShowImportAll,
            clearSelected,
            isLockItem,
            onPositionInfoClick,
            onCancelItemBlur,
            isConflictSelectAll,
            onConflictItemClick,
            onConflictItemSelectAllClick,
            selectedConflictItemIndexSet,
            conflictItemsBetweenImportedFilesAndTranslatedFiles,
            importedTranslateItemMap,
            MainName,
            hasTranslateProvider,
            onItemBlur,
            onItemMouseDown,
            isTargetTranslateDataHasEmptyMedia,
            currentTranslateDataItems,
            currentSelectedItem,
            isSameLanguage,
            untranslatedTranslateDataItems,
            translatedTranslateDataItems,

            /**
             * 获取表格右侧的译文的显示名称
             */
            getDisplayNameOfTargetItem(key: string): string {
                let localItem: IWrapperTranslateItem | undefined;
                if (currentTab.value === 'imported') {
                    localItem = importedTranslateItemMap.value[key];
                } else {
                    const changedItem = changedTranslateItemMap.value[key];
                    const targetItem = targetPanelTranslateData.value?.items[key];
                    localItem = changedItem ?? targetItem;
                }

                if (!localItem) {
                    return '';
                }
                if (localItem.type === TranslateItemType.Media) {
                    return localItem?.displayName ?? key;
                }

                return localItem?.value ?? '';
            },
            /** 获取表格左侧的显示名称 */
            getDisplayNameOfLocalItem(key: string): string {
                let item: IWrapperTranslateItem|undefined;

                if (currentTab.value === 'imported'){
                    item = localPanelTranslateData.value?.items[key] ?? importedTranslateItemMap.value[key];
                    return item.value;
                } else {
                    item = localPanelTranslateData.value?.items[key];
                }

                if (item?.type === TranslateItemType.Media) {
                    return item.displayName || key;
                }
                if (isSameLanguage.value) {
                    return key;
                } else {
                    return item?.displayName || '';
                }
            },
            positionInfoOfAssociation: computed(() => {
                if (!currentSelectedItem.value) {
                    return [];
                }
                const indexDataElement = indexData.find((item) => item.key === currentSelectedItem.value!.key);

                if (!indexDataElement) {
                    return [];
                }

                const items = indexDataElement.associations
                    .filter((it) => it.assetInfo)
                    .map((it) => {
                        return {
                            path: relative(Editor.Project.path, it.assetInfo!.file),
                            uuid: it.assetInfo!.uuid,
                        };
                    });

                return Array.from(new Set(items)).map((it) => new Iterator(it));
            }),
            nodeUuidOfAssociation: computed(() => {
                if (!currentSelectedItem.value) {
                    return [];
                }
                const indexDataElement = indexData.find((item) => item.key === currentSelectedItem.value!.key);
                if (!indexDataElement) {
                    return [];
                }
                return Array.from(
                    new Set(
                        indexDataElement.associations
                            .filter((it) => it.nodeUuid)
                            .map(it => it.nodeUuid),
                    ),
                ).map((it) => new Iterator(it));
            }),
            saving,
            onSaveClick,
            targetPanelTranslateData,
            localPanelTranslateData,
            currentVariantsItem,
            /** 有修改行为的资源 */
            changedTranslateItemMap,

            TranslateItemType: ref(TranslateItemType),
            onTabClick,

            /** 导入的 po 文件里的数据集 */
            importedTranslateData: ref([]),
            /** 当前选择的标签 */
            currentTab,
            Tab: ref(Tab),
            /** 输入框被写入了内容 */
            async onInputChanged(key: string, value: string) {
                let item: Readonly<IWrapperTranslateItem | undefined>;
                if (currentTab.value === 'imported') {
                    const item: IWrapperTranslateItem = importedTranslateItemMap.value[key];
                    item.value = value;
                    return;
                } else {
                    item =
                        changedTranslateItemMap.value[key] ??
                        targetPanelTranslateData.value?.items[key] ??
                        localPanelTranslateData.value?.items[key];
                }
                if (!item) {
                    console.error(`cannot find item with key ${key}`);
                    return;
                }
                if (item.type === TranslateItemType.Media) {
                    if (value === '') {
                        updateChangedTranslateItemMap(
                            item,
                            '',
                            '',
                            undefined,
                            item._variants,
                            item.associations,
                        );
                    } else {
                        const originItem = localPanelTranslateData.value?.items[key];
                        if (!originItem) {
                            console.error(`cannot find item with key ${key} from local`);
                            return;
                        }
                        const info: AssetInfo | null = await wrapper.getFileInfoByUUIDOrPath(join(ProjectAssetPath, value));
                        if (info && extname(originItem.displayName || '') === extname(value)) {
                            updateChangedTranslateItemMap(
                                item,
                                info.uuid,
                                WrapperTranslateItem.getDisplayName({ item, assetInfo: info }),
                                info,
                                item._variants,
                                item.associations,
                            );
                        }
                    }
                } else {
                    updateChangedTranslateItemMap(
                        item,
                        value,
                        WrapperTranslateItem.getDisplayName({ item, value }),
                        null,
                        item._variants,
                        item.associations,
                    );
                }
            },
            /**  点击翻译按钮 */
            async onTranslateClick() {
                await executeCallbackWithOutDirty(async () => {
                    saving.value = true;
                    setTimeout(async () => {
                        await updateTargetTranslateData(await wrapper.autoTranslate(targetPanelTranslateData.value!.locale));
                        saving.value = false;
                    });
                });
            },
            variantKeys,
            /** 打开变体 */
            onVariantsClick(key: string) {
                const targetItem = targetPanelTranslateData.value?.['items'][key];
                const changedItem = changedTranslateItemMap.value[key];
                const importedItem = importedTranslateItemMap.value[key];
                if (currentTab.value === 'imported' && importedItem) {
                    currentVariantsItem.value = WrapperTranslateItem.parse(importedItem);
                } else if (changedItem) {
                    currentVariantsItem.value = WrapperTranslateItem.parse(changedItem);
                } else if (targetItem) {
                    currentVariantsItem.value = WrapperTranslateItem.parse(targetItem);
                } else {
                    console.error(
                        'An item that does not have a value should not be able to set variations',
                        `key:${key}`,
                    );
                    return;
                }

                for (let index = 0; index < variantKeys.value.length; index++) {
                    const variantkey = variantKeys.value[index];
                    const itemKey = `${key}_${variantkey}`;
                    const oldItem = targetItem?._variants.find((item) => item.key === itemKey);
                    if (!oldItem) {
                        currentVariantsItem.value._variants.push(
                            new WrapperTranslateItem(
                                itemKey,
                                '',
                                currentVariantsItem.value.type,
                                '',
                                null,
                                undefined,
                                undefined,
                                true,
                            ),
                        );
                    }
                }
                function getIndexFromVariants(key: string): number {
                    const arr = key.split('_');
                    if (arr.length) {
                        const ext = arr[arr.length - 1];
                        return variantKeys.value.findIndex((item) => item === ext);
                    } else {
                        return -1;
                    }
                }
                currentVariantsItem.value._variants = currentVariantsItem.value._variants.sort((a, b): number => {
                    return getIndexFromVariants(a.key) - getIndexFromVariants(b.key);
                });
            },
            /** 保存变体 */
            onVariantsConfirm() {
                if (!currentVariantsItem.value) {
                    console.error(`save variants error: currentVariantsItem.value is ${currentVariantsItem.value}`);
                    return;
                }
                currentVariantsItem.value._variants = currentVariantsItem.value._variants.filter((item) => item.value);
                replaceVariant = true;
                save([currentVariantsItem.value!], { mergeOptions: { replaceVariant: true } });
                currentVariantsItem.value = null;
            },
            /** 取消设置变体 */
            onVariantsCancel() {
                if (!currentVariantsItem.value) {
                    console.error(`save variants error: currentVariantsItem.value is ${currentVariantsItem.value}`);
                    return;
                }
                currentVariantsItem.value = null;
            },
            /** 删除当前变体 */
            async onVariantsDelete() {
                if (!currentVariantsItem.value) {
                    console.error(`save variants error: currentVariantsItem.value is ${currentVariantsItem.value}`);
                    return;
                }
                const result = await Editor.Dialog.info(Editor.I18n.t(MainName + '.translate.delete_warning'), {
                    buttons: [
                        Editor.I18n.t(MainName + '.translate.cancel'),
                        Editor.I18n.t(MainName + '.translate.confirm'),
                    ],
                    cancel: 0,
                    default: 1,
                });
                if (result.response === 1) {
                    currentVariantsItem.value!._variants = [];
                    replaceVariant = true;
                    await save([currentVariantsItem.value!]);
                }
                currentVariantsItem.value = null;
            },

            /** 条目是否禁用变体 */
            isVariantsDisable(key: string): boolean {
                if (currentTab.value === 'imported'){
                    return false;
                } else {
                    const changedItem = changedTranslateItemMap.value[key];
                    const targetItem = targetPanelTranslateData.value?.['items'][key];
                    return changedItem?.value === '' || (!changedItem && !targetItem?.value);
                }
            },

            /** 是否可以点击删除变体 */
            isDeleteVariantsDisable: computed((): boolean => {
                if (currentVariantsItem.value?._variants.some((item) => item.value)) {
                    return false;
                }
                return true;
            }),

            /**
             * 点击导入全部的按钮
             */
            async onImportAllClick() {
                await executeCallbackWithOutDirty(async () => {
                    isShowImportAll.value = true;

                });
            },
            async onImportAllConfirm() {
                const mediaLength = untranslatedTranslateDataItems.value.filter(
                    (item) => item?.type === TranslateItemType.Media,
                ).length;
                const title = Editor.I18n.t(MainName + '.translate.auto_import_warning')
                    .replace('{length}', mediaLength.toString())
                    .replace('{localLocale}', importAllFrom.value)
                    .replace('{targetLocale}', importAllTo.value);
                const result = await Editor.Dialog.info(title, {
                    buttons: [
                        Editor.I18n.t(MainName + '.translate.cancel'),
                        Editor.I18n.t(MainName + '.translate.confirm'),
                    ],
                    cancel: 0,
                    default: 1,
                });
                if (result.response) {
                    const items = await wrapper.importFilesFromDirectory(
                        props.targetLocale,
                        importAllFrom.value,
                        importAllTo.value,
                    );
                    updateTargetTranslateData(items);
                }
                isShowImportAll.value = false;
            },
            async onImportAllCancel() {
                isShowImportAll.value = false;
            },
            /**
             * 点击导入某个外部文件
             */
            async onFileInputClick() {
                await executeCallbackWithOutDirty(async () => {
                    onTabClick(2);
                    const result = await Editor.Dialog.select({ extensions: 'po,csv,xlsx', multi: false, path: await getLastImportedFileProfile() });
                    if (!result.canceled) {
                        const filePath = result.filePaths[0];
                        setLastImportedFileProfile(filePath);
                        const translateFileType: TranslateFileType = getTranslateFileType(filePath);
                        const locale: string = targetPanelTranslateData.value!.bcp47Tag;

                        let importResult: ITranslateItem[] = await wrapper.importTranslateFile(filePath, translateFileType, locale);
                        /**
                         * 新导入的文件中冲突的内容
                         */
                        const conflictItems: IWrapperTranslateItem[] = importResult.filter(item => importedTranslateItemMap.value[item.key]);
                        if (conflictItems.length) {
                            const cancel = 2;
                            const dialogResult = await Editor.Dialog.warn(Editor.I18n.t(MainName + '.translate.import_file_conflicts_with_file_warning').replace('{num}', conflictItems.length.toString()), {
                                buttons: [
                                    Editor.I18n.t(MainName + '.translate.jump'),
                                    Editor.I18n.t(MainName + '.translate.cover'),
                                    Editor.I18n.t(MainName + '.translate.cancel'),
                                ],
                                cancel,
                            });
                            const response = dialogResult.response;
                            if (response === 0) {
                                importResult = importResult.filter(item => !conflictItems.includes(item));
                            } else if (response === 1) {

                            } else if (response === 2) {
                                return;
                            }
                        }

                        for (let index = 0; index < importResult.length; index++) {
                            const result = importResult[index];
                            importedTranslateItemMap.value[result.key] = result;
                        }

                    }
                });
            },
            /**
             * 点击单个导入，导入某个文件
             */
            async onImportClick(key: string) {
                const item: Readonly<IWrapperTranslateItem> | undefined =
                    localPanelTranslateData.value!.items[key] ??
                    changedTranslateItemMap.value[key] ??
                    targetPanelTranslateData.value?.items[key];

                if (!item?.assetInfo) {
                    console.error(`[${MainName}]: item has not assetInfo`, item);
                    return;
                }
                let extName: string;
                if (item.assetInfo.type === 'cc.ImageAsset'){
                    // copy from cc.ImageAsset['extnames']
                    extName = 'png,jpg,jpeg,bmp,webp,pvr,pkm,astc';
                } else {
                    extName = extname(item.assetInfo.file).replace('.', '');
                }
                const result = await Editor.Dialog.select({
                    multi: false,
                    path: ProjectAssetPath,
                    type: 'file',
                    extensions: extName,
                });
                if (!result.canceled) {
                    const assetInfo = await wrapper.getFileInfoByUUIDOrPath(result.filePaths[0]);
                    if (assetInfo) {
                        const value = assetInfo.uuid;
                        const displayName = WrapperTranslateItem.getDisplayName({ assetInfo });
                        updateChangedTranslateItemMap(
                            item,
                            value,
                            displayName,
                            assetInfo,
                            item._variants,
                            item.associations,
                        );
                    } else {
                        console.error('A non-project resource was selected,please select another resource.');
                    }
                }
            },
            /** 点击文件与原文冲突的取消按钮 */
            onConflictCancelClick() {
                conflictItemsBetweenImportedFilesAndTranslatedFiles.value = [];
                selectedConflictItemIndexSet.value.clear();
                replaceVariant = false;
            },
            /** 点击文件与原文冲突的覆盖按钮 */
            async onConflictConfirmClick() {
                const items = Array.from(selectedConflictItemIndexSet.value).map(item => conflictItemsBetweenImportedFilesAndTranslatedFiles.value[item]);
                await save(items, { force: true });
            },
            async onHomeClick() {
                if (Object.keys(changedTranslateItemMap.value).length > 0) {
                    const result = await Editor.Dialog.warn(Editor.I18n.t(MainName + '.translate.quit_warning'), {
                        buttons: [
                            Editor.I18n.t(MainName + '.translate.cancel'),
                            Editor.I18n.t(MainName + '.translate.confirm'),
                        ],
                        cancel: 0,
                        default: 0,
                    });
                    if (result.response === 1) {
                        emit('home');
                    }
                } else {
                    emit('home');
                }
            },
        };
    },
};
</script>
<style></style>
