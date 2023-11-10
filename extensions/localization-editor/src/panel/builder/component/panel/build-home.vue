<template>
    <div class="home">
        <!-- <ui-prop>
            <ui-label slot="label" i18n :value="MainName +'.build.use_polyfill'"></ui-label>
            <div slot="content">
                <ui-prop v-for=" (item, key) of polyfillMap" :key="key">
                    <ui-label slot="label" :value="item.name">
                    </ui-label>
                    <ui-checkbox
                        slot="content"
                        :value="item.value"
                        @confirm="onPolyfillMapConfirm(item.uuid!, $event.target.value)">
                    </ui-checkbox>
                </ui-prop>
            </div>
        </ui-prop> -->
        <ui-prop>
            <ui-label
                slot="label"
                i18n
                :value="MainName + '.build.use_language'"></ui-label>
            <div slot="content">
                <div class="language">
                    <div id="fix-box">
                        <ui-input
                            id="search"
                            placeholder="Search..."
                            :value="languageSearch"
                            @input="languageSearch = $event.target.value">
                        </ui-input>
                        <div id="selectAll" class="selectItem">
                            <ui-checkbox :value="selectAll" @confirm="selectAll = $event.target.value"></ui-checkbox>
                            <ui-label i18n :value="MainName + '.build.select_all'"></ui-label>
                        </div>
                    </div>
                    <div id="selectContainer">
                        <div
                            v-for=" (item) in filteredLanguageList"
                            :key="item.locale"
                            class="selectItem">
                            <ui-checkbox
                                :value="item.locale === defaultLanguage ? true : item.value"
                                :readonly="item.locale === defaultLanguage || item.locale === fallbackLanguage"
                                @confirm="onLanguageMapConfirm(item.locale, $event.target.value)"></ui-checkbox>
                            <ui-label
                                :class="{ weakGray: item.locale === defaultLanguage || item.locale === fallbackLanguage }"
                                :value="item.displayName">
                            </ui-label>
                            <ui-label class="weakGray" :value="`(${item.locale})`">
                            </ui-label>
                        </div>
                    </div>
                </div>
            </div>
        </ui-prop>
        <ui-prop>
            <ui-label
                slot="label"
                i18n
                :value="MainName + '.build.default_language'"></ui-label>
            <ui-select
                slot="content"
                :value="defaultLanguageDisplayName"
                @confirm="onDefaultLanguageConfirm($event.target.value)">
                <option v-for="item, key of languageMap" :key="key">
                    {{ item.displayName }}
                </option>
            </ui-select>
        </ui-prop>
        <ui-prop>
            <ui-label
                slot="label"
                i18n
                :value="MainName + '.build.fallback_language'"></ui-label>
            <ui-select
                slot="content"
                :value="fallbackLanguageDisplayName"
                @confirm="onFallbackLanguageConfirm($event.target.value)">
                <option v-for="item, key of languageMap" :key="key">
                    {{ item.displayName }}
                </option>
            </ui-select>
        </ui-prop>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { MainName } from '../../../../lib/core/service/util/global';
import type ILanguageInfo from '../../../../lib/builder/ILanguageInfo';
import type ILocalizationEditorOptions from '../../../../lib/builder/ILocalizationEditorOptions';
import type IPolyFillInfo from '../../../../lib/builder/IPolyfillInfo';
import type { ITaskOptions } from '../../../../lib/builder/ITaskOptions';
import type { IEventBusEventMap } from '../../../../lib/core/service/util/IEventMap';
import { getLanguageDisplayName } from '../../../share/scripts/libs/languageMap';
import { container } from 'tsyringe';
import builder from '../../../../lib/builder/builder';
import WrapperMainIPC from '../../../../lib/core/ipc/WrapperMainIPC';
import EventBusService from '../../../../lib/core/service/util/EventBusService';

const wrapper = container.resolve(WrapperMainIPC);
const eventBus = container.resolve(EventBusService);

type UUID = string;
async function updatePolyfillMap(options: Readonly<ITaskOptions>, key?: string) {
    const polyfillFileInfos = await builder.getICUlPolyfillFileInfos();
    if (polyfillFileInfos.length) {
        /**
         * 默认的 polyfill 信息映射表
         */
        const defaultPolyfillMap: Record<UUID, IPolyFillInfo> = {};
        /**
         * polyfill 目录下的所有 ts 脚本
         */
        for (let index = 0; index < polyfillFileInfos.length; index++) {
            const info = polyfillFileInfos[index];

            const polyfillInfo: IPolyFillInfo = {
                name: info.name,
                value: true,
                uuid: info.uuid,
            };
            defaultPolyfillMap[info.uuid] = polyfillInfo;
        }

        const polyfillMapFromOptions: Readonly<Record<UUID, IPolyFillInfo>> = options?.packages['localization-editor']?.polyfillMap ?? {};
        const tempMap: Record<UUID, IPolyFillInfo> = {};
        for (const key in defaultPolyfillMap) {
            tempMap[key] = Object.assign(polyfillMapFromOptions[key] ?? defaultPolyfillMap[key]);
        }
        polyfillMap.value = tempMap;
    }
}

/**
 * 更新语言配置
 */
async function updateLanguageMapAndLocalLocale(options: ITaskOptions, key?: string) {
    /**
     * 所有编译好的语言的数据
     */
    const languageInfoList = await wrapper.getAllLanguageConfigs();
    const defaultLanguageMap: Record<Intl.BCP47LanguageTag, ILanguageInfo> = {};
    const defaultDefaultLanguage = await wrapper.getLocalLanguage() || '';
    let defaultLanguageFromOptions: Readonly<string | undefined> = options.packages['localization-editor']?.defaultLanguage;
    let fallbackLanguageFromOptions: Readonly<string | undefined> = options.packages['localization-editor']?.fallbackLanguage;
    for (let index = 0; index < languageInfoList.length; index++) {
        const languageInfo = languageInfoList[index];
        defaultLanguageMap[languageInfo.bcp47Tag] = { 'locale': languageInfo.bcp47Tag, 'value': false };
    }
    // 忽略不在语言列表内的旧配置
    if (typeof defaultLanguageFromOptions === 'string' && !languageInfoList.some(item => item.bcp47Tag === defaultLanguageFromOptions)) {
        defaultLanguageFromOptions = undefined;
    }
    // 忽略不在语言列表内的旧配置
    if (typeof fallbackLanguageFromOptions === 'string' && !languageInfoList.some(item => item.bcp47Tag === fallbackLanguageFromOptions)) {
        fallbackLanguageFromOptions = undefined;
    }
    const languageMapFromOptions: Readonly<Record<Intl.BCP47LanguageTag, ILanguageInfo>> = options.packages['localization-editor']?.targetLanguageMap ?? {};
    const tempMap: Record<Intl.BCP47LanguageTag, ILanguageInfo & { displayName: string }> = {};
    for (const key in defaultLanguageMap) {
        tempMap[key] = Object.assign(languageMapFromOptions[key] ?? defaultLanguageMap[key]);
        // 需要更新 displayName 因为语言可能切换了
        tempMap[key].displayName = getLanguageDisplayName(tempMap[key].locale);
    }
    languageMap.value = tempMap;
    defaultLanguage.value = defaultLanguageFromOptions ?? defaultDefaultLanguage;
    // 如果 options 里面没有配置则设置为默认值
    if (!defaultLanguageFromOptions) {
        eventBus.emit('changeBuilderOptions', `packages.${MainName}.${defaultLanguageKey}`, defaultLanguage.value, !defaultLanguage.value);
        onLanguageMapConfirm(defaultLanguage.value, true);
    }
    // 默认 fallback 语言与默认的默认语言一致
    fallbackLanguage.value = fallbackLanguageFromOptions ?? defaultDefaultLanguage;
    if (!fallbackLanguageFromOptions) {
        eventBus.emit('changeBuilderOptions', `packages.${MainName}.${fallbackLanguageKey}`, fallbackLanguage.value, false);
        onLanguageMapConfirm(fallbackLanguage.value, true);
    }
}
const defaultLanguageDisplayName = computed((): string => {
    return getLanguageDisplayName(defaultLanguage.value);
});
const fallbackLanguageDisplayName = computed(() => {
    return getLanguageDisplayName(fallbackLanguage.value);
});

const onBuilderUpdated: IEventBusEventMap['onBuilderUpdated'] = async (options, key) => {
    //await updatePolyfillMap(options, key);
    await updateLanguageMapAndLocalLocale(options, key);
};

const selectAll = computed({
    get() {
        return Object.values(languageMap.value).every(item => item.value);
    },
    set(value: boolean) {
        for (const key in languageMap.value) {
            if (!value) {
                if (key === defaultLanguage.value || key === fallbackLanguage.value) {
                    continue;
                }
            }
            onLanguageMapConfirm(key, value);
        }
    },
});
const languageSearch = ref('');
const filteredLanguageList = computed(() => {
    const items = Object.values(languageMap.value);
    const search = languageSearch.value.toLowerCase();
    if (search.length === 0) {
        return items;
    }
    return items.filter(item => item.displayName.toLowerCase().includes(search) || item.locale.toLowerCase().includes(search));
});

onMounted(() => {
    eventBus.on('onBuilderUpdated', onBuilderUpdated);
});

onUnmounted(() => {
    eventBus.off('onBuilderUpdated', onBuilderUpdated);
});

const languageMap = ref({} as Record<Intl.BCP47LanguageTag, ILanguageInfo & { displayName: string }>);
const polyfillMap = ref({} as Record<string, IPolyFillInfo>);
const defaultLanguage = ref('');
const fallbackLanguage = ref('');

const polyfillKey: keyof ILocalizationEditorOptions = 'polyfillMap';
const targetLanguageKey: keyof ILocalizationEditorOptions = 'targetLanguageMap';
const defaultLanguageKey: keyof ILocalizationEditorOptions = 'defaultLanguage';
const fallbackLanguageKey: keyof ILocalizationEditorOptions = 'fallbackLanguage';

function onPolyfillMapConfirm(key: string, value: boolean) {
    const item = polyfillMap.value[key];
    if (item) {
        item.value = value;
        eventBus.emit('changeBuilderOptions', `packages.${MainName}.${polyfillKey}.${key}`, item, false);
    }
}

function onLanguageMapConfirm(key: Intl.BCP47LanguageTag, value: boolean) {
    const item = languageMap.value[key];
    if (item) {
        item.value = value;
        eventBus.emit('changeBuilderOptions', `packages.${MainName}.${targetLanguageKey}.${key}`, {
            locale: item.locale,
            value,
        }, false);
    }
}

async function onDefaultLanguageConfirm(displayName: string) {
    const value = Object.values(languageMap.value).find(item => item.displayName === displayName)?.locale;
    if (!value) {
        console.error(`The content named ${displayName} cannot be found in the table`);
        return;
    }
    // 如果配置文件存在并且还设置了主语言为默认语言为空则不允许编译
    eventBus.emit('changeBuilderOptions', `packages.${MainName}.${defaultLanguageKey}`, value, !displayName);
    onLanguageMapConfirm(value, true);
}

function onFallbackLanguageConfirm(displayName: Intl.BCP47LanguageTag) {
    const value = Object.values(languageMap.value).find(item => item.displayName === displayName)?.locale;
    if (!value) {
        console.error(`The content named ${displayName} cannot be found in the table`);
        return;
    }
    eventBus.emit('changeBuilderOptions', `packages.${MainName}.${fallbackLanguageKey}`, value, false);
    onLanguageMapConfirm(value, true);
}

</script>
