/* eslint-disable semi */
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import ITranslateProviderConfig, { SupportedTranslateProvider } from '../core/entity/config/ITranslateProviderConfig';
import IScanOption from '../core/entity/messages/IScanOption';
import IAssociation from '../core/entity/translate/IAssociation';
import ILanguageConfig from '../core/entity/translate/ILanguageConfig';
import ITranslateItem from '../core/entity/translate/ITranslateItem';
import IWrapperLanguageConfig from '../core/entity/translate/IWrapperLanguageConfig';
import IWrapperTranslateItem from '../core/entity/translate/IWrapperTranslateItem';
import IWrapperTranslateItemMap from '../core/entity/translate/IWrapperTranslateItemMap';
import { MergeTranslateItemOption, PromiseLikeOrOriginal, TranslateFileType } from '../core/type/type';

export default interface IWrapperMainThread {

    setDirty(dirty: boolean): Promise<void>;
    getDirty(): Promise<boolean>;

    uninstall (): Promise<boolean>

    closePanel (): Promise<boolean>

    toggle: () => Promise<boolean>

    getEnable: () => Promise<boolean>

    getAllLanguageTranslationDataList (): Promise<IWrapperTranslateItem[]>

    /**
     * 获取当前服务商
     */
    getCurrentTranslateProvider (): Promise<ITranslateProviderConfig | undefined>

    /**
     * 设置当前服务商
     */
    setCurrentTranslateProvider (service: ITranslateProviderConfig): Promise<void | undefined>

    /**
     * 去除当前服务商
     * @returns
     */
    clearTranslateProvider (): Promise<void | undefined>

    /** 获取服务商支持的所有语言 */
    getProviderLanguages (provider?: SupportedTranslateProvider): Promise<Record<string, string>>

    setLanguageConfig (languageConfig: ILanguageConfig): Promise<void | undefined>
    /**
     *
     * @returns 当前翻译商的数组
     */
    getTranslateProviders (): Promise<string[]>
    /**
     * 获取本地开发语言的配置
     */
    getLocalLanguageConfig (): Promise<IWrapperLanguageConfig | null>

    getLanguageConfig (locale?: string): Promise<IWrapperLanguageConfig | null>

    /**
     * 仅获取 indexData 的时候才会给 association 额外附带 assetInfo
     */
    getIndexData (): Promise<IWrapperTranslateItem[]>
    /** 得到本地语言和所有其他语言 */
    getAllLanguageConfigs (): Promise<IWrapperLanguageConfig[]>
    /**
     * 设置当前本地开发语言语言
     */
    setLocalLanguage (locale: string): Promise<void>

    /**
     * 移除某个语言的配置文件
     * @param language
     * @returns 删除是否成功
     */
    removeLanguage (language: string): Promise<boolean>

    /**
     * 移除所有语言的配置文件
     */
    removeAllLanguage(): Promise<boolean>;

    /**
     * 传入一个路径自动导入文件
     * @param toTag
     * @param fromPattern
     * @param toPattern
     */
    importFilesFromDirectory (toTag: string, fromPattern: string, toPattern: string): Promise<IWrapperTranslateItem[]>

    compile (locales: Intl.BCP47LanguageTag[]): Promise<void>

    previewBy (locale: Intl.BCP47LanguageTag): Promise<void | undefined>

    /**
     * 自动翻译
     * 目标语言
     */
    autoTranslate (targetLocale: string): Promise<IWrapperTranslateItem[]>

    /**
     * 将数字格式化
     * 例如 2000 -> 2k
     * @param num
     */
    numberFormat (num: number): string

    /** 获取语言的配置 */
    getTranslateData (language?: string): Promise<IWrapperTranslateItem[]>

    /** 获取当前使用的语言 */
    getLocalLanguage (): Promise<string>

    /** 获取扫描与统计的记录 */
    getScanOptions (): Promise<IScanOption[]>
    /**
     * 统计与扫描
     */
    scan (scanOptions: IScanOption[]): Promise<ITranslateItem[] | undefined>
    saveTranslateData (
        locale: string,
        translateMap: IWrapperTranslateItemMap | ITranslateItem[],
        saveOptions?: MergeTranslateItemOption,
    ): Promise<void>

    /**
     * 通过 uuid 获取资源的信息
     * @param uuidOrPath
     */
    getFileInfoByUUIDOrPath (uuidOrPath: string): Promise<AssetInfo | null>

    /**
     *
     * @param code
     * @param fallback default is code
     */
    getDisplayNameOfLanguage (code: Intl.BCP47LanguageTag, fallback?: 'code' | 'none'): PromiseLikeOrOriginal<string>

    /** 添加语言 */
    addTargetLanguage (locale: Intl.BCP47LanguageTag): Promise<void | undefined>

    addAssociation (key: string, association: IAssociation): Promise<void | undefined>

    removeAssociation (key: string, association: IAssociation): Promise<void | undefined>

    importTranslateFile: (filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<ITranslateItem[]>

    exportTranslateFile: (filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag) => PromiseLikeOrOriginal<void>

    getTranslateProvider (provider: SupportedTranslateProvider): Promise<ITranslateProviderConfig | undefined>
}
