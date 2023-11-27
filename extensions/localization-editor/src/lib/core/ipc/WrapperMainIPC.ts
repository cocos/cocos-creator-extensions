import 'reflect-metadata';
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import { singleton } from 'tsyringe';
import IMainThread from '../../main/IMainThread';
import IWrapperMainThread from '../../main/IWrapperMainThread';
import ITranslateProviderConfig, { SupportedTranslateProvider } from '../entity/config/ITranslateProviderConfig';
import TranslateProviderConfig from '../entity/config/TranslateProviderConfig';
import IScanOption from '../entity/messages/IScanOption';
import ScanOption from '../entity/messages/ScanOption';
import ILanguageConfig from '../entity/translate/ILanguageConfig';
import ITranslateItem from '../entity/translate/ITranslateItem';
import IWrapperLanguageConfig from '../entity/translate/IWrapperLanguageConfig';
import IWrapperTranslateItem from '../entity/translate/IWrapperTranslateItem';
import IWrapperTranslateItemMap from '../entity/translate/IWrapperTranslateItemMap';
import LanguageConfig from '../entity/translate/LanguageConfig';
import TranslateData from '../entity/translate/TranslateData';
import TranslateItem from '../entity/translate/TranslateItem';
import WrapperTranslateItem from '../entity/translate/WrapperTranslateItem';
import { CustomError } from '../error/Errors';
import EventBusService from '../service/util/EventBusService';
import { MainName } from '../service/util/global';
import { MergeTranslateItemOption, TranslateFileType } from '../type/type';
import EditorMessageService from '../service/EditorMessageService';
import IAssociation from '../entity/translate/IAssociation';
import MainIPC from './MainIPC';

// 对主进程的返回参数进一步封装，得到渲染进程、构建进程要用到的信息
@singleton()
export default class WrapperMainIPC implements IWrapperMainThread {
    constructor(
        public editorMessageService: EditorMessageService,
        public eventBus: EventBusService,
        public mainIPC: MainIPC,
    ){}

    setDirty(dirty: boolean): Promise<void> {
        return this.requestMainMethod('setDirty', dirty);
    }

    async getDirty(): Promise<boolean> {
        return !!await this.requestMainMethod('getDirty');
    }

    async uninstall(): Promise<boolean> {
        return !!await this.requestMainMethod('uninstall');
    }

    async closePanel(): Promise<boolean> {
        return !!await this.requestMainMethod('closePanel');
    }

    async toggle(): Promise<boolean>{
        return !!await this.requestMainMethod('toggle');
    }
    async getEnable(): Promise<boolean>{
        return !!await this.requestMainMethod('getEnable');
    }
    async getAllLanguageTranslationDataList(): Promise<IWrapperTranslateItem[]> {
        const allConfig = await this.getAllLanguageConfigs();
        const arr: IWrapperTranslateItem[] = [];
        for (let index = 0; index < allConfig.length; index++) {
            const config = allConfig[index];
            const items = await this.getTranslateData(config.bcp47Tag) ?? [];
            items.forEach((item) => item.locale = config.bcp47Tag);
            arr.push(...items);
        }
        return arr;
    }
    /**
     * 获取当前服务商
     */
    getCurrentTranslateProvider(): Promise<ITranslateProviderConfig | undefined> {
        return this.requestMainMethod('getCurrentTranslateProvider');
    }

    getTranslateProvider(configType: SupportedTranslateProvider): Promise<ITranslateProviderConfig | undefined> {
        return this.requestMainMethod('getTranslateProvider', configType);
    }

    /**
     * 设置当前服务商
     */
    setCurrentTranslateProvider(service: ITranslateProviderConfig) {
        return this.requestMainMethod('setCurrentTranslateProvider', TranslateProviderConfig.parse(service)!);
    }

    /**
     * 去除当前服务商
     * @returns
     */
    clearTranslateProvider() {
        return this.requestMainMethod('clearTranslateProvider');
    }

    /** 获取服务商支持的所有语言 */
    async getProviderLanguages(provider?: SupportedTranslateProvider): Promise<Record<string, string>> {
        if (provider) {
            const languages: string[] = await this.requestMainMethod('getTranslateProviderSupportedLanguages', provider) ?? [];
            const value: Record<string, string> = {};
            languages.forEach((item) => {
                value[item] = this.getDisplayNameOfLanguage(item, 'none') || Editor.I18n.t(`${MainName}.${provider}.${item}`) || item;
            });
            return value;
        } else {
            return {};
        }
    }

    setLanguageConfig(languageConfig: ILanguageConfig) {
        return this.requestMainMethod('setLanguageConfig', LanguageConfig.parse(languageConfig));
    }
    /**
     *
     * @returns 当前翻译商的数组
     */
    async getTranslateProviders(): Promise<string[]> {
        return await this.requestMainMethod('getTranslateProviders') ?? [];
    }

    /**
     * 获取本地开发语言的配置
     */
    async getLocalLanguageConfig() {
        return this.getLanguageConfig();
    }

    async getLanguageConfig(locale?: string): Promise<IWrapperLanguageConfig | null> {
        const currentLanguage = await this.getLocalLanguage();
        if (!currentLanguage) {
            return null;
        }
        const config = await this.requestMainMethod('getLanguageConfig', locale);
        if (config) {
            if (config.bcp47Tag === currentLanguage) {
                config.translateFinished = config.translateTotal;
            }
            return { displayName: this.getDisplayNameOfLanguage(config.bcp47Tag), ...config };
        }
        return null;
    }

    async getIndexData(): Promise<IWrapperTranslateItem[]> {
        const result = await this.requestMainMethod('getIndexData') ?? [];
        const arr: IWrapperTranslateItem[] = [];
        if (result?.length) {
            for (let index = 0; index < result.length; index++) {
                const translateItem = result[index];
                const wrapperTranslateItem = await WrapperTranslateItem.toSerialize(translateItem);
                for (let index = 0; index < wrapperTranslateItem.associations.length; index++) {
                    const association = wrapperTranslateItem.associations[index];
                    if (association.reference) {
                        const assetInfo = await this.editorMessageService.queryAssetInfo(association.reference);
                        if (assetInfo) {
                            association.assetInfo = assetInfo;
                        }
                    }
                }
                arr.push(wrapperTranslateItem);
            }
        }
        return arr;
    }
    /** 得到本地语言和所有其他语言 */
    async getAllLanguageConfigs(): Promise<IWrapperLanguageConfig[]> {
        const currentLanguage = await this.getLocalLanguage();
        if (!currentLanguage) {
            return [];
        }
        const local = await this.getLocalLanguageConfig();
        const configs = (await this.requestMainMethod('getAllLanguageConfigs') as ILanguageConfig[] ?? [] as ILanguageConfig[])
            .filter((item) => item.bcp47Tag !== TranslateData.INDEX_LOCALE)
            .map((config) => ({
                displayName: this.getDisplayNameOfLanguage(config.bcp47Tag),
                ...config,
            }));

        return local ? [local, ...configs] : configs;
    }
    /**
     * 设置当前本地开发语言语言
     */
    setLocalLanguage(locale: string): Promise<void> {
        return this.requestMainMethod('setLocalLanguageLocale', locale);
    }

    /**
     * 移除某个语言的配置文件
     * @param language
     * @returns 删除是否成功
     */
    async removeLanguage(language: string): Promise<boolean> {
        // 弹窗询问是否删除语言
        const result = await Editor.Dialog.info(Editor.I18n.t(MainName + '.ask_delete'), {
            buttons: [
                Editor.I18n.t(MainName + '.cancel'),
                Editor.I18n.t(MainName + '.confirm')
            ],
            cancel: 0,
            default: 1,
        });
        if (result.response) {
            return !!(await this.requestMainMethod('removeTargetLanguage', language));
        }
        return false;
    }

    /**
     * 移除所有语言的配置文件
     */
    async removeAllLanguage(): Promise<boolean> {
        try {
            const localLanguageConfig: IWrapperLanguageConfig | null = await this.getLocalLanguageConfig();
            const configs: IWrapperLanguageConfig[] = await this.getAllLanguageConfigs();
            for (let config of configs) {
                if (localLanguageConfig && localLanguageConfig.bcp47Tag !== config.bcp47Tag) {
                    await this.requestMainMethod('removeTargetLanguage', config.bcp47Tag);
                }
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * 传入一个路径自动导入文件
     * @param locale
     * @param path
     */
    async importFilesFromDirectory(toTag: string, fromPattern: string, toPattern: string) {
        const result = await this.requestMainMethod('importMediaFiles', toTag, fromPattern, toPattern) ?? [];
        const items: IWrapperTranslateItem[] = [];
        for (let index = 0; index < result.length; index++) {
            const translateItem = result[index];
            items.push(await WrapperTranslateItem.toSerialize(translateItem));
        }
        return items;
    }

    /**
     * 增加并保存更新需要持久化的数据
     * @param data
     * @returns
     */
    saveTranslateData(
        locale: string,
        data: IWrapperTranslateItemMap | ITranslateItem[],
        mergeTranslateOption?: MergeTranslateItemOption,
    ): Promise<void> {
        let items: ITranslateItem[];
        if (data instanceof Array){
            items = data.map(TranslateItem.parse);
        } else {
            items = Object.values(data).map((item) => item && TranslateItem.parse(item)).filter(Boolean) as ITranslateItem[];
        }
        return this.requestMainMethod('saveTranslateData', locale, items, mergeTranslateOption);
    }

    compile(locales: Intl.BCP47LanguageTag[]) {
        return this.requestMainMethod('compile', locales);
    }

    previewBy(locale: Intl.BCP47LanguageTag) {
        return this.requestMainMethod('previewBy', locale);
    }

    /**
     * 自动翻译
     * 目标语言
     */
    async autoTranslate(targetLocale: string): Promise<IWrapperTranslateItem[]> {
        const results = await this.requestMainMethod('autoTranslate', targetLocale) ?? [];
        const items: IWrapperTranslateItem[] = [];
        for (let index = 0; index < results.length; index++) {
            const translateItem = results[index];
            items.push(await WrapperTranslateItem.toSerialize(translateItem));
        }
        return items;
    }

    protected formatter = Intl.NumberFormat('en', { notation: 'compact' });

    /**
     * 将数字格式化
     * 例如 2000 -> 2k
     * @param num
     */
    numberFormat(num: number) {
        return this.formatter.format(num);
    }

    /** 获取语言的配置 */
    async getTranslateData(language?: string): Promise<IWrapperTranslateItem[]> {
        const targetLocalItems: ITranslateItem[] = await this.requestMainMethod('getTranslateData', language) ?? [];
        const localLanguage = await this.getLocalLanguage();
        // 如果请求的是本地语言，则需要额外的加载数据
        if (!language || localLanguage === language) {
            const emptyValueItems: ITranslateItem[] = await this.requestMainMethod('getIndexData') ?? [];
            for (let index = 0; index < emptyValueItems.length; index++) {
                const emptyItem = emptyValueItems[index];
                if (!targetLocalItems.some((item) => item.key === emptyItem.key)) {
                    targetLocalItems.push(emptyItem);
                }
            }
        }
        const arr: IWrapperTranslateItem[] = [];
        if (targetLocalItems) {
            for (let index = 0; index < targetLocalItems.length; index++) {
                const item = targetLocalItems[index];
                arr.push(await WrapperTranslateItem.toSerialize(item));
            }
        }
        return arr;
    }

    /** 获取当前使用的语言 */
    async getLocalLanguage(): Promise<string> {
        return await this.requestMainMethod('getLocalLanguage') || '';
    }

    /** 获取扫描与统计的记录 */
    async getScanOptions(): Promise<IScanOption[]> {
        return await this.requestMainMethod('getScanOptions') ?? [];
    }
    /**
     * 统计与扫描
     */
    scan(scanOptions: IScanOption[]): Promise<ITranslateItem[] | undefined> {
        return this.requestMainMethod('scan', scanOptions as ScanOption[]);
    }

    /**
     * 通过 uuid 获取资源的信息
     * @param uuidOrPath
     */
    getFileInfoByUUIDOrPath(uuidOrPath: string): Promise<AssetInfo | null> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Editor.Message.request('asset-db', 'query-asset-info', uuidOrPath);
    }

    /**
     *
     * @param code
     * @param fallback default is code
     * @returns
     */
    getDisplayNameOfLanguage(code: Intl.BCP47LanguageTag, fallback: 'code' | 'none' = 'code') {
        const result = Editor.I18n.t(`${MainName}.language_code.${code}`);
        if (!result && fallback === 'none'){
            return result;
        }
        return result ?? code;
    }

    /** 添加语言 */
    addTargetLanguage(locale: Intl.BCP47LanguageTag) {
        return this.requestMainMethod('addTargetLanguage', locale);
    }

    /** 执行主进程的方法 */
    async requestMainMethod<T extends keyof IMainThread>(
        method: T,
        ...args: Parameters<IMainThread[T]>
    ): Promise<UnPromise<ReturnType<IMainThread[T]>> | undefined> {
        try {
            // @ts-ignore
            const result = await this.mainIPC[method](...args);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result as UnPromise<ReturnType<IMainThread[T]>>;
        } catch (error) {
            const customError = error as CustomError | Error;
            this.eventBus.emit('onCustomError', customError);
            return undefined;
        }
    }

    addAssociation(key: string, association: IAssociation) {
        return this.requestMainMethod('addAssociation', key, association);
    }

    removeAssociation(key: string, association: IAssociation) {
        return this.requestMainMethod('removeAssociation', key, association);
    }
    async importTranslateFile(filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag): Promise<ITranslateItem[]> {
        return await this.requestMainMethod('importTranslateFile', filePath, translateFileType, locale) ?? [];
    }

    async exportTranslateFile(filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag): Promise<void> {
        return this.requestMainMethod('exportTranslateFile', filePath, translateFileType, locale);
    }
}
