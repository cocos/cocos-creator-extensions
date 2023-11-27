/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { singleton } from 'tsyringe';
import EditorMessageService from '../core/service/EditorMessageService';
import TranslateItem from '../core/entity/translate/TranslateItem';
import SceneIPC from '../core/ipc/SceneIPC';
import TranslateDataSourceService from '../core/service/persistent/TranslateDataSourceService';
import ProjectConfigService from '../core/service/persistent/ProjectConfigService';
import TranslateProviderConfig from '../core/entity/config/TranslateProviderConfig';
import ScanOption from '../core/entity/messages/ScanOption';
import TranslateService from '../core/service/translate/TranslateService';
import LanguageConfig from '../core/entity/translate/LanguageConfig';
import FileScanService from '../core/service/scanner/FileScanService';
import CompileService from '../core/service/persistent/CompileService';
import { MergeTranslateItemOption, ScanProgressFunction, TranslateFileType } from '../core/type/type';
import TranslateData, { TranslateDataObject } from '../core/entity/translate/TranslateData';
import TranslateProviderFactory from '../core/factory/TranslateProviderFactory';
import IMainThread from './IMainThread';
import Association from '../core/entity/translate/Association';
import IScanOption from '../core/entity/messages/IScanOption';
import ITranslateItem from '../core/entity/translate/ITranslateItem';
import ILanguageConfig from '../core/entity/translate/ILanguageConfig';
import IAssociation from '../core/entity/translate/IAssociation';
import ITranslateProviderConfig, {
    SupportedTranslateProvider,
    TranslateProviderSupportedLanguages,
} from '../core/entity/config/ITranslateProviderConfig';
import type { ResourceBundle, ResourceList } from '../../../@types/runtime/l10n';
import EditorConfigService from '../core/service/persistent/EditorConfigService';
import TranslateFileService from '../core/service/external-translate/TranslateFileService';
import { CustomError } from '../core/error/Errors';
import { MessageCode } from '../core/entity/messages/MainMessage';
import { MainName } from '../core/service/util/global';
import { IBuildTaskItemJSON } from '@cocos/creator-types/editor/packages/builder/@types/public';
import TrackService from '../core/service/track/track-service';

/**
 * MainService
 * 为了在方法中使用this指向MainService单例
 * 必须将所有name() {}形式的方法设计为property = () => {}
 * @export
 * @class MainThread
 */
@singleton()
export default class MainThread implements IMainThread {
    protected _dirtyData = false;

    constructor(
        protected editorMessageService: EditorMessageService,
        protected sceneIPC: SceneIPC,
        protected translateDataSourceService: TranslateDataSourceService,
        protected projectConfigService: ProjectConfigService,
        protected editorConfigService: EditorConfigService,
        protected translateService: TranslateService,
        protected fileScanService: FileScanService,
        protected compileService: CompileService,
        protected translateProviderFactory: TranslateProviderFactory,
        protected translateFileService: TranslateFileService,
        protected trackService: TrackService,
    ) { }

    /**
     * 表示 l10n 数据有 dirty
     */
    async setDirty(dirty: boolean): Promise<void> {
        this._dirtyData = dirty
    }
    async getDirty(): Promise<boolean> {
        return this._dirtyData;
    }

    toggle = async (): Promise<boolean> => {
        return await this.projectConfigService.toggle();
    };

    enableChanged = async (): Promise<void> => {
        await this.projectConfigService.enableChanged();
    };

    getEnable = async (): Promise<boolean> => {
        return this.projectConfigService.getEnable();
    };

    openPanel = async () => {
        await this.readConfig();
        this.editorMessageService.openPanel();
    };

    closePanel = async () => {
        await this.editorMessageService.closePanel();
    };

    /**
     * 预览翻译
     * @param locale
     */
    previewBy = async (locale: Intl.BCP47LanguageTag): Promise<void> => {
        const resourceBundle = await this.compileService.compile([locale]);
        await this.editorConfigService.preview(locale);
        await this.sceneIPC.addResourceBundle(locale, resourceBundle);
        await this.sceneIPC.preview(locale);
    };

    /**
     * 扫描文件
     * @param scanOptions
     */
    scan = async (scanOptions: IScanOption[]): Promise<ITranslateItem[]> => {
        const start = new Date().getTime();
        await this.sceneIPC.scan(scanOptions);
        await this.projectConfigService.setScanOptions(scanOptions.map(ScanOption.parse));
        const end = new Date().getTime();
        const local = this.getLocalLanguage();
        if (local) {
            await this.previewBy(local);
        }
        console.debug(`用时 ${end - start}`);
        return this.getTranslateData();
    };

    /**
     * 卸载插件
     */
    uninstall = async (): Promise<void> => {
        const dirty = await this.editorMessageService.queryDirty();
        if (dirty) {
            throw new CustomError(MessageCode.EDITOR_DIRTY);
        }
        await Promise.all([
            this.clearTranslateData(),
            this.projectConfigService.uninstall(),
            this.editorConfigService.uninstall(),
        ]);
        await this.translateDataSourceService.uninstall();
        // await this.editorMessageService.softReload();
    };

    clearTranslateData = async () => {
        const dirty = await this.editorMessageService.queryDirty();
        if (dirty) {
            throw new CustomError(MessageCode.EDITOR_DIRTY);
        }
        let indexData: TranslateData = new TranslateData(TranslateData.INDEX_LOCALE);
        try {
            indexData = this.translateDataSourceService.getClonedIndexData();
        } catch (e) {
            console.log(`[${MainName}]: Uninstall but not found index data, this does not cause additional errors, just a note, presumably the uninstall has been performed before`);
        }
        const currentPreview = this.editorConfigService.getCurrentPreview();
        const local = this.projectConfigService.getLocalLanguage();
        if (local && (local !== currentPreview)) {
            await this.previewBy(local);
        }
        await Promise.all([
            this.sceneIPC.uninstall([]),
            this.translateDataSourceService.removeAllTranslateData(),
        ]);
    };

    readConfig = async (): Promise<void> => {
        await this.projectConfigService.read();
        await this.translateDataSourceService.read();
        await this.editorConfigService.read();
    };

    getIndexData = (): TranslateItem[] => {
        const indexData = this.translateDataSourceService.getClonedIndexData();
        return Array.from(indexData.items.values());
    };

    getLocalLanguage = (): Intl.BCP47LanguageTag | undefined => this.projectConfigService.getLocalLanguage();

    /**
     * 获取某语言的数据
     * @param locale 当locale为空时返回当前开发语言的数据
     */
    getTranslateData = (locale?: Intl.BCP47LanguageTag): TranslateItem[] => {
        if (locale) {
            return Array.from(this.translateDataSourceService.getClonedTranslateData(locale)?.items?.values() ?? []);
        } else {
            return Array.from(this.translateDataSourceService.getClonedLocalTranslateData().items.values());
        }
    };

    getTranslateDataObject = (locale?: Intl.BCP47LanguageTag): TranslateDataObject => {
        if (locale) {
            return this.translateDataSourceService.getClonedTranslateData(locale)?.toObject();
        } else {
            return this.translateDataSourceService.getClonedLocalTranslateData().toObject();
        }
    };

    /**
     * 保存某语言的数据（持久化）
     * @param locale
     * @param translateItems
     * @param mergeOption
     */
    saveTranslateData = async (locale: Intl.BCP47LanguageTag, translateItems: ITranslateItem[], mergeOption?: MergeTranslateItemOption) => {
        const translateItemsImpl = translateItems?.map(TranslateItem.parse);
        await this.translateDataSourceService.saveTranslateData(locale, translateItemsImpl, mergeOption);
    };

    /**
     * 设置本地开发语言
     * @param locale
     */
    setLocalLanguageLocale = async (locale: Intl.BCP47LanguageTag): Promise<void> => {
        await this.translateDataSourceService.setLocalTranslateData(locale);
        await this.projectConfigService.setLocalLanguage(locale);
        await this.sceneIPC.reloadResourceData();
    };

    setLanguageConfig = async (languageConfig: ILanguageConfig) => {
        const languageConfigImpl = LanguageConfig.parse(languageConfig);
        await this.translateDataSourceService.updateLanguageConfig(languageConfig.bcp47Tag, languageConfigImpl);
    };

    /**
     * 获取目标语言配置
     * @param locale 当locale为空时返回本地开发语言的配置
     */
    getLanguageConfig = (locale?: Intl.BCP47LanguageTag): LanguageConfig | undefined => {
        if (locale) {
            return this.translateDataSourceService.getLanguageConfig(locale);
        } else {
            return this.translateDataSourceService.getLocalLanguageConfig();
        }
    };

    /**
     * 获取所有目标语言配置
     * 不包括本地开发语言
     */
    getAllLanguageConfigs = (): LanguageConfig[] => this.translateDataSourceService.getAllLanguageConfigs();

    /**
     * 增加目标翻译语言
     * @param locale
     */
    addTargetLanguage = async (locale: Intl.BCP47LanguageTag) => {
        await this.translateDataSourceService.addTranslateData(locale);
    };

    /**
     * 删除目标翻译语言
     * 删除前必须先切换语言预览
     * @param locale
     */
    removeTargetLanguage = async (locale: Intl.BCP47LanguageTag): Promise<boolean> => {
        const currentPreview = this.editorConfigService.getCurrentPreview();
        const local = this.getLocalLanguage();
        if (locale === currentPreview && local) {
            await this.previewBy(local);
        }
        await this.sceneIPC.removeResourceBundle(locale);
        return await this.translateDataSourceService.removeTranslateData(locale);
    };

    /**
     * 获取翻译服务商
     */
    getTranslateProviders = (): string[] => [
        'YOUDAO',
        'GOOGLE',
    ];

    /**
     * 获取翻译服务商所支持的语言
     */
    getTranslateProviderSupportedLanguages = (provider: SupportedTranslateProvider): string[] | undefined => TranslateProviderSupportedLanguages.get(provider);

    /**
     * 获取当前翻译服务商
     */
    getCurrentTranslateProvider = (): TranslateProviderConfig | undefined => this.editorConfigService.getCurrentTranslateProviderConfig();

    getTranslateProvider = async (configType: SupportedTranslateProvider): Promise<ITranslateProviderConfig | undefined> => {
        return this.editorConfigService.getTranslateProviderConfig(configType);
    };

    /**
     * 设置当前翻译服务商
     * @param providerConfig
     */
    setCurrentTranslateProvider = async (providerConfig: ITranslateProviderConfig): Promise<void> => {
        const providerConfigImpl = this.translateProviderFactory.createProvider(TranslateProviderConfig.parse(providerConfig));
        const shouldClear = await this.editorConfigService.setCurrentTranslateProviderConfig(providerConfigImpl);
        if (shouldClear) {
            await this.translateDataSourceService.clearAllLanguagesProvider();
        }
    };

    clearTranslateProvider = async (): Promise<void> => {
        await this.editorConfigService.clearTranslateProviderConfig();
    };

    /**
     * 更新value（持久化）
     * @param locale
     * @param key
     * @param value
     */
    changeValue = (locale: Intl.BCP47LanguageTag, key: string, value: string): void => {
        this.translateDataSourceService.changeValue(locale, key, value);
    };

    /**
     * 获取扫描目录列表
     */
    getScanOptions = (): ScanOption[] => this.projectConfigService.getScanOptions();

    /**
     * 自动翻译，通过传入目标翻译语言的tag，
     * 能够在数据服务中找出带翻译语言的所有数据，
     * 以此能够自动翻译
     * @param toTag 内部规范的language tag
     * @return 返回翻译后的key-value对
     */
    autoTranslate = async (toTag: Intl.BCP47LanguageTag): Promise<TranslateItem[]> => {
        const from = this.translateDataSourceService.getClonedLocalTranslateData();
        const to = this.translateDataSourceService.getClonedTranslateData(toTag);
        return await this.translateService.translate(from, to);
    };

    /**
     * 自动导入一个文件夹内可以导入的文件
     * @param toTag 内部规范的 language tag
     * @param fromPattern
     * @param toPattern
     */
    importMediaFiles = async (toTag: Intl.BCP47LanguageTag, fromPattern: string, toPattern: string): Promise<TranslateItem[]> => {
        const from = this.translateDataSourceService.getClonedLocalTranslateData();
        const to = this.translateDataSourceService.getClonedTranslateData(toTag);
        const progress: ScanProgressFunction = (finished, total) => {
            this.editorMessageService.translateProgress(finished, total, toTag);
        };
        return await this.fileScanService.scan(from, to, { fromPattern, toPattern, progress });
    };

    /**
     * @deprecated
     * @param locales
     */
    compile = async (locales: Intl.BCP47LanguageTag[]): Promise<void> => {
        locales = locales.filter((it) => it !== TranslateData.INDEX_LOCALE);
        await this.compileService.compile(locales);
    };

    addAssociation = async (key: string, association: IAssociation): Promise<void> => {
        const associationImpl = Association.create(association);
        await this.translateDataSourceService.addAssociation(key, associationImpl);
    };

    removeAssociation = async (key: string, association: IAssociation): Promise<void> => {
        const associationImpl = Association.create(association);
        await this.translateDataSourceService.removeAssociation(key, associationImpl);
    };

    onSceneReady = async (uuid: string) => {
        await this.sceneIPC.onSceneReady(uuid);
    };

    getResourceList = async (): Promise<ResourceList | undefined> => {
        const currentPreview = this.editorConfigService.getCurrentPreview();
        const localLanguage = this.projectConfigService.getLocalLanguage();
        if (!localLanguage) return undefined;
        const languages = this.translateDataSourceService.getAllLanguageTags();
        return {
            defaultLanguage: currentPreview ?? localLanguage,
            fallbackLanguage: localLanguage,
            languages,
        };
    };

    getResourceBundle = async (locales: Intl.BCP47LanguageTag[]): Promise<ResourceBundle> => {
        return await this.compileService.compile(locales);
    };

    exportTranslateFile = async (filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag): Promise<void> => {
        const data = this.translateDataSourceService.getClonedTranslateData(locale);
        const local = this.translateDataSourceService.getClonedLocalTranslateData();
        await this.translateFileService.exportTranslateFile(filePath, translateFileType, data, local);
    };

    importTranslateFile = async (filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag): Promise<ITranslateItem[]> => {
        const translateData = await this.translateFileService.importTranslateFile(filePath, translateFileType, locale);
        return Array.from(translateData.items.values());
    };

    onBuilderTaskChanged = async (id: string, info?: IBuildTaskItemJSON) => {
        await this.trackService.trackBuilder(id, info);
    };
}
