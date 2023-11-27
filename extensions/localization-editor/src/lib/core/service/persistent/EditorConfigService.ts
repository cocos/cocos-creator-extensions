import IPersistentService from './IPersistentService';
import IEditorConfig from '../../entity/config/IEditorConfig';
import EditorConfig from '../../entity/config/EditorConfig';
import { MainName } from '../util/global';
import { singleton } from 'tsyringe';
import TranslateProviderConfig from '../../entity/config/TranslateProviderConfig';
import TranslateProviderConfigMap from '../../entity/config/TranslateProviderConfigMap';
import { SupportedTranslateProvider } from '../../entity/config/ITranslateProviderConfig';

@singleton()
export default class EditorConfigService implements IPersistentService<IEditorConfig> {
    private editorConfig!: EditorConfig;
    private translateProviderConfigMap!: TranslateProviderConfigMap;

    initDataSource(): void {
        this.editorConfig = new EditorConfig();
        this.translateProviderConfigMap = new TranslateProviderConfigMap();
    }

    async persistent(): Promise<void> {
        await Editor.Profile.setConfig(MainName, EditorConfig.ConfigName, this.editorConfig, 'local');
        await Editor.Profile.setConfig(MainName, TranslateProviderConfigMap.ConfigsName, this.translateProviderConfigMap, 'global');
    }

    async read(): Promise<void> {
        try {
            this.editorConfig = EditorConfig.parse(await Editor.Profile.getConfig(MainName, EditorConfig.ConfigName));
            this.translateProviderConfigMap = TranslateProviderConfigMap.parse(await Editor.Profile.getConfig(MainName, TranslateProviderConfigMap.ConfigsName));
        } catch (e) {
            this.initDataSource();
        }
    }

    async uninstall(): Promise<void> {
        await Editor.Profile.removeConfig(MainName, EditorConfig.ConfigName);
        await Editor.Profile.removeConfig(MainName, TranslateProviderConfigMap.ConfigsName);
        this.initDataSource();
    }

    async preview(locale: Intl.BCP47LanguageTag): Promise<void> {
        this.editorConfig.currentPreview = locale;
        await this.persistent();
    }

    getCurrentPreview(): Intl.BCP47LanguageTag | undefined {
        return this.editorConfig.currentPreview;
    }

    getCurrentTranslateProviderConfig(): TranslateProviderConfig | undefined {
        const configType = this.translateProviderConfigMap.currentProviderConfig;
        if (configType) {
            return this.getTranslateProviderConfig(configType);
        }
        return undefined;
    }

    getTranslateProviderConfig(configType: SupportedTranslateProvider): TranslateProviderConfig | undefined {
        return this.translateProviderConfigMap.translateProviderConfigs[configType]?.clone();
    }

    async setCurrentTranslateProviderConfig(providerConfig: TranslateProviderConfig): Promise<boolean> {
        let shouldClear = false;
        if (providerConfig.name !== this.translateProviderConfigMap.currentProviderConfig) {
            shouldClear = true;
        }
        this.translateProviderConfigMap.currentProviderConfig = providerConfig.name;
        this.translateProviderConfigMap.translateProviderConfigs[providerConfig.name] = providerConfig;
        await this.persistent();
        return shouldClear;
    }

    async clearTranslateProviderConfig() {
        this.translateProviderConfigMap = new TranslateProviderConfigMap();
        await this.persistent();
    }
}
