/* eslint-disable prefer-rest-params */
import { singleton } from 'tsyringe';
import { ResourceList, ResourceBundle } from '../../../../@types/runtime/l10n';
import IMainThread from '../../main/IMainThread';
import ITranslateProviderConfig, { SupportedTranslateProvider } from '../entity/config/ITranslateProviderConfig';
import IScanOption from '../entity/messages/IScanOption';
import IAssociation from '../entity/translate/IAssociation';
import ILanguageConfig from '../entity/translate/ILanguageConfig';
import ITranslateItem from '../entity/translate/ITranslateItem';
import { TranslateDataObject } from '../entity/translate/TranslateData';
import { MainName } from '../service/util/global';
import { MergeTranslateItemOption, TranslateFileType } from '../type/type';

@singleton()
export default class MainIPC implements IMainThread {
    private async executeMainScript<T>(method: string, ...args: any): Promise<T> {
        return await Editor.Message.request(MainName, method, ...args) as T;
    }

    async getDirty(): Promise<boolean> {
        return !!await this.executeMainScript('get-dirty');
    }

    async setDirty(dirty: boolean): Promise<void> {
        return this.executeMainScript('set-dirty', dirty);
    }

    async toggle(): Promise<boolean> {
        return this.executeMainScript('toggle', ...arguments);
    }

    async enableChanged(): Promise<void> {
        return this.executeMainScript('enable-changed', ...arguments);
    }

    async getEnable(): Promise<boolean> {
        return this.executeMainScript('get-enable', ...arguments);
    }

    async openPanel(): Promise<void> {
        return this.executeMainScript('open-panel', ...arguments);
    }

    async closePanel(): Promise<void> {
        return this.executeMainScript('close-panel', ...arguments);
    }

    async previewBy(locale: Intl.BCP47LanguageTag): Promise<void> {
        return this.executeMainScript('preview-by', ...arguments);
    }

    async scan(scanOptions: IScanOption[]): Promise<ITranslateItem[]> {
        return this.executeMainScript('scan', ...arguments);
    }

    async uninstall(): Promise<void> {
        return this.executeMainScript('uninstall', ...arguments);
    }

    async readConfig(): Promise<void> {
        return this.executeMainScript('read-config', ...arguments);
    }

    async getIndexData(): Promise<ITranslateItem[]> {
        return this.executeMainScript('get-index-data', ...arguments);
    }

    async getLocalLanguage(): Promise<Intl.BCP47LanguageTag | undefined> {
        return this.executeMainScript('get-local-language', ...arguments);
    }

    async getTranslateData(locale?: Intl.BCP47LanguageTag): Promise<ITranslateItem[]> {
        return this.executeMainScript('get-translate-data', ...arguments);
    }

    async getTranslateDataObject(locale?: Intl.BCP47LanguageTag): Promise<TranslateDataObject> {
        return this.executeMainScript('get-translate-data-object', ...arguments);
    }

    async saveTranslateData(locale: Intl.BCP47LanguageTag, translateItems: ITranslateItem[], mergeOption?: MergeTranslateItemOption): Promise<void> {
        return this.executeMainScript('save-translate-data', ...arguments);
    }

    async clearTranslateData(): Promise<void> {
        return this.executeMainScript('clear-translate-data', ...arguments);
    }

    async setLocalLanguageLocale(locale: Intl.BCP47LanguageTag): Promise<void> {
        return this.executeMainScript('set-local-language-locale', ...arguments);
    }

    async setLanguageConfig(languageConfig: ILanguageConfig): Promise<void> {
        return this.executeMainScript('set-language-config', ...arguments);
    }

    async getLanguageConfig(locale?: Intl.BCP47LanguageTag): Promise<ILanguageConfig | undefined> {
        return this.executeMainScript('get-language-config', ...arguments);
    }

    async getAllLanguageConfigs(): Promise<ILanguageConfig[]> {
        return this.executeMainScript('get-all-language-configs', ...arguments);
    }

    async addTargetLanguage(locale: Intl.BCP47LanguageTag): Promise<void> {
        return this.executeMainScript('add-target-language', ...arguments);
    }

    async removeTargetLanguage(locale: Intl.BCP47LanguageTag): Promise<boolean> {
        return this.executeMainScript('remove-target-language', ...arguments);
    }

    async getTranslateProviders(): Promise<string[]> {
        return this.executeMainScript('get-translate-providers', ...arguments);
    }

    async getTranslateProviderSupportedLanguages(provider: SupportedTranslateProvider): Promise<string[] | undefined> {
        return this.executeMainScript('get-translate-provider-supported-languages', ...arguments);
    }

    async getCurrentTranslateProvider(): Promise<ITranslateProviderConfig | undefined> {
        return this.executeMainScript('get-current-translate-provider', ...arguments);
    }

    async getTranslateProvider(configType: SupportedTranslateProvider): Promise<ITranslateProviderConfig | undefined> {
        return this.executeMainScript('get-translate-provider', ...arguments);
    }

    async setCurrentTranslateProvider(providerConfig: ITranslateProviderConfig): Promise<void> {
        return this.executeMainScript('set-current-translate-provider', ...arguments);
    }

    async clearTranslateProvider(): Promise<void> {
        return this.executeMainScript('clear-translate-provider', ...arguments);
    }

    async changeValue(locale: Intl.BCP47LanguageTag, key: string, value: string): Promise<void> {
        return this.executeMainScript('change-value', ...arguments);
    }

    async getScanOptions(): Promise<IScanOption[]> {
        return this.executeMainScript('get-scan-options', ...arguments);
    }

    async autoTranslate(toTag: Intl.BCP47LanguageTag): Promise<ITranslateItem[]> {
        return this.executeMainScript('auto-translate', ...arguments);
    }

    async importMediaFiles(toTag: Intl.BCP47LanguageTag, fromPattern: string, toPattern: string): Promise<ITranslateItem[]> {
        return this.executeMainScript('import-media-files', ...arguments);
    }

    async compile(locales: Intl.BCP47LanguageTag[]): Promise<void> {
        return this.executeMainScript('compile', ...arguments);
    }

    async addAssociation(key: string, association: IAssociation): Promise<void> {
        return this.executeMainScript('add-association', ...arguments);
    }

    async removeAssociation(key: string, association: IAssociation): Promise<void> {
        return this.executeMainScript('remove-association', ...arguments);
    }

    async getResourceList(): Promise<ResourceList | undefined> {
        return this.executeMainScript('get-resource-list', ...arguments);
    }

    async getResourceBundle(locals: Intl.BCP47LanguageTag[]): Promise<ResourceBundle> {
        return this.executeMainScript('get-resource-bundle', ...arguments);
    }

    async importTranslateFile(filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag): Promise<ITranslateItem[]> {
        return this.executeMainScript('import-translate-file', ...arguments);
    }

    async exportTranslateFile(filePath: string, translateFileType: TranslateFileType, locale: Intl.BCP47LanguageTag): Promise<void> {
        return this.executeMainScript('export-translate-file', ...arguments);
    }
}
