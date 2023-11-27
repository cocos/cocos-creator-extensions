import { assetManager } from 'cc';
import IL10nManagerWrapper from './il10n-manager-wrapper';
import { ALLOW_NAMESPACE, ASSET_NAMESPACE, DEFAULT_NAMESPACE, MainName } from '../service/util/global';
import { singleton } from 'tsyringe';
import { i18n } from 'i18next';
import EditorMessageService from '../service/EditorMessageService';
import MainIPC from '../ipc/MainIPC';
import type { ResourceBundle, L10nManager } from '../../../../@types/runtime/l10n';

@singleton()
export default class L10nManagerWrapper implements IL10nManagerWrapper {
    static readonly DEFAULT_NAMESPACE = DEFAULT_NAMESPACE;
    static readonly ASSET_NAMESPACE = ASSET_NAMESPACE;
    static readonly ALLOW_NAMESPACE = ALLOW_NAMESPACE;

    constructor(
        public editorMessageService: EditorMessageService,
        public mainIpc: MainIPC,
    ) { }

    async l10nManager(): Promise<L10nManager> {
        return ((await Editor.Module.importProjectModule(`db://${MainName}/core/l10n-manager.ts`)) as { default: L10nManager }).default;
    }

    async preview(locale: Intl.BCP47LanguageTag): Promise<void> {
        const l10nManager = await this.l10nManager();
        if (!l10nManager.isInitialized()) {
            await l10nManager.createIntl({});
        }
        await (await this.l10nManager()).changeLanguage(locale);
        await this.releaseAsset();
        this.editorMessageService.softReload();
    }

    async reloadResourceData(): Promise<boolean> {
        const l10nManager = (await this.l10nManager());
        const result = l10nManager.reloadResourceData();
        await this.releaseAsset();
        await this.editorMessageService.softReload();
        return result;
    }

    async addResourceBundle(language: Intl.BCP47LanguageTag, resourceBundle: ResourceBundle): Promise<void> {
        await Promise.all(L10nManagerWrapper.ALLOW_NAMESPACE.map(namespace => this.addResourceBundleForNamespace(language, resourceBundle, namespace)));
        this.editorMessageService.softReload();
    }

    private async addResourceBundleForNamespace(language: Intl.BCP47LanguageTag, resourceBundle: ResourceBundle, namespace: string) {
        const l10nManager = (await this.l10nManager());
        const _intl: i18n | undefined = l10nManager['_intl'];
        if (_intl?.hasResourceBundle(language, namespace)) {
            _intl?.removeResourceBundle(language, namespace);
        }
        const resourceItem = resourceBundle[language][namespace];
        _intl?.addResourceBundle(language, namespace, resourceItem, true, true);
        l10nManager['resourceBundle'][language] ??= {};
        l10nManager['resourceBundle'][language][namespace] = resourceItem;
    }

    async removeResourceBundle(language: Intl.BCP47LanguageTag): Promise<void> {
        const l10nManager = (await this.l10nManager());
        const _intl: i18n | undefined = l10nManager['_intl'];
        _intl?.removeResourceBundle(language, L10nManagerWrapper.DEFAULT_NAMESPACE);
        _intl?.removeResourceBundle(language, L10nManagerWrapper.ASSET_NAMESPACE);
        delete l10nManager['resourceBundle'][language];
        await this.releaseAsset();
        this.editorMessageService.softReload();
    }

    async uninstall(): Promise<void> {
        const l10nManager = (await this.l10nManager());
        l10nManager['_intl'] = undefined;
        l10nManager['resourceList'] = undefined;
        l10nManager['resourceBundle'] = {};
    }

    /**
     * 释放 assetManager 中所有资源
     */
    async releaseAsset() {
        assetManager.releaseAll();
    }

}
