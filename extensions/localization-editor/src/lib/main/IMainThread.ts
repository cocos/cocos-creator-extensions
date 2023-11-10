/* eslint-disable semi */
import { MergeTranslateItemOption, PromiseLikeOrOriginal, TranslateFileType } from '../core/type/type'
import { TranslateDataObject } from '../core/entity/translate/TranslateData';
import IScanOption from '../core/entity/messages/IScanOption';
import ITranslateItem from '../core/entity/translate/ITranslateItem';
import ILanguageConfig from '../core/entity/translate/ILanguageConfig';
import ITranslateProviderConfig, {
    SupportedTranslateProvider,
} from '../core/entity/config/ITranslateProviderConfig'
import IAssociation from '../core/entity/translate/IAssociation';
import type { ResourceBundle, ResourceList } from '../../../@types/runtime/l10n'

export default interface IMainThread {

    setDirty(dirty: boolean): PromiseLikeOrOriginal<void>;
    getDirty(): PromiseLikeOrOriginal<boolean>;

    toggle: () => PromiseLikeOrOriginal<boolean>

    enableChanged: () => PromiseLikeOrOriginal<void>

    getEnable: () => PromiseLikeOrOriginal<boolean>

    openPanel: () => PromiseLikeOrOriginal<void>

    /**
     * 预览翻译
     * @param locale
     */
    previewBy: (locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<void>

    /**
     * 扫描文件
     * @param scanOptions
     */
    scan: (scanOptions: IScanOption[]) => PromiseLikeOrOriginal<ITranslateItem[]>

    /**
     * 卸载插件
     */
    uninstall: () => PromiseLikeOrOriginal<void>

    closePanel: () => PromiseLikeOrOriginal<void>

    readConfig: () => PromiseLikeOrOriginal<void>

    getIndexData: () => PromiseLikeOrOriginal<ITranslateItem[]>

    getLocalLanguage: () => PromiseLikeOrOriginal<Intl.BCP47LanguageTag | undefined>

    /**
     * 获取某语言的数据
     * @param locale 当locale为空时返回当前开发语言的数据
     */
    getTranslateData: (locale?: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<ITranslateItem[]>

    getTranslateDataObject: (locale?: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<TranslateDataObject>

    /**
     * 保存某语言的数据（持久化）
     * @param locale
     * @param translateItems
     * @param mergeOption
     */
    saveTranslateData: (locale: Intl.BCP47LanguageTag, translateItems: ITranslateItem[], mergeOption?: MergeTranslateItemOption) => PromiseLikeOrOriginal<void>

    /**
     * 清楚所有翻译数据，但保留服务商token和搜索设置
     */
    clearTranslateData: () => PromiseLikeOrOriginal<void>
    /**
     * 设置本地开发语言
     * @param locale
     */
    setLocalLanguageLocale: (locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<void>

    setLanguageConfig: (languageConfig: ILanguageConfig) => PromiseLikeOrOriginal<void>

    /**
     * 获取目标语言配置
     * @param locale 当locale为空时返回本地开发语言的配置
     */
    getLanguageConfig: (locale?: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<ILanguageConfig | undefined>

    /**
     * 获取所有目标语言配置
     * 不包括本地开发语言
     */
    getAllLanguageConfigs: () => PromiseLikeOrOriginal<ILanguageConfig[]>

    /**
     * 增加目标翻译语言
     * @param locale
     */
    addTargetLanguage: (locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<void>

    /**
     * 删除目标翻译语言
     * @param locale
     */
    removeTargetLanguage: (locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<boolean>

    /**
     * 获取翻译服务商
     */
    getTranslateProviders: () => PromiseLikeOrOriginal<string[]>

    /**
     * 获取翻译服务商所支持的语言
     */
    getTranslateProviderSupportedLanguages: (provider: SupportedTranslateProvider) => PromiseLikeOrOriginal<string[] | undefined>

    /**
     * 获取当前翻译服务商
     */
    getCurrentTranslateProvider: () => PromiseLikeOrOriginal<ITranslateProviderConfig | undefined>

    getTranslateProvider: (configType: SupportedTranslateProvider) => PromiseLikeOrOriginal<ITranslateProviderConfig | undefined>

    /**
     * 设置当前翻译服务商
     * @param providerConfig
     */
    setCurrentTranslateProvider: (providerConfig: ITranslateProviderConfig) => PromiseLikeOrOriginal<void>

    clearTranslateProvider: () => PromiseLikeOrOriginal<void>

    /**
     * 更新value（持久化）
     * @param locale
     * @param key
     * @param value
     */
    changeValue: (locale: Intl.BCP47LanguageTag, key: string, value: string) => PromiseLikeOrOriginal<void>

    /**
     * 获取扫描目录列表
     */
    getScanOptions: () => PromiseLikeOrOriginal<IScanOption[]>

    /**
     * 自动翻译，通过传入目标翻译语言的tag，
     * 能够在数据服务中找出带翻译语言的所有数据，
     * 以此能够自动翻译
     * @param toTag 内部规范的language tag
     * @return 返回翻译后的key-value对
     */
    autoTranslate: (toTag: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<ITranslateItem[]>

    /**
     * 自动导入一个文件夹内可以导入的文件
     * @param toTag 内部规范的 language tag
     */
    importMediaFiles: (toTag: Intl.BCP47LanguageTag, fromPattern: string, toPattern: string) => PromiseLikeOrOriginal<ITranslateItem[]>

    /**
     * @deprecated
     * @param locales
     */
    compile: (locales: Intl.BCP47LanguageTag[]) => PromiseLikeOrOriginal<void>

    addAssociation: (key: string, association: IAssociation) => PromiseLikeOrOriginal<void>

    removeAssociation: (key: string, association: IAssociation) => PromiseLikeOrOriginal<void>

    getResourceList: () => PromiseLikeOrOriginal<ResourceList | undefined>

    getResourceBundle: (locals: Intl.BCP47LanguageTag[]) => PromiseLikeOrOriginal<ResourceBundle>

    importTranslateFile: (filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<ITranslateItem[]>

    exportTranslateFile: (filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<void>
}
