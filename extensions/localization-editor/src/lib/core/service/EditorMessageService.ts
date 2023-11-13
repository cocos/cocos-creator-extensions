/* eslint-disable prefer-rest-params */
import { AssetInfo, QueryAssetsOption } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import { singleton } from 'tsyringe';
import { MainName } from './util/global';

@singleton()
export default class EditorMessageService {

    async refreshPreview(): Promise<void> {
        return (await Editor.Message.request('preview', 'reload-terminal')) as void;
    }

    async queryUUID(url: string): Promise<string> {
        return (await Editor.Message.request('asset-db', 'query-uuid', url)) as string;
    }

    async queryAssets(options: QueryAssetsOption): Promise<AssetInfo[]> {
        return (await Editor.Message.request('asset-db', 'query-assets', options)) as AssetInfo[];
    }

    async queryAssetInfo(filePath: string): Promise<AssetInfo | null> {
        return (await Editor.Message.request('asset-db', 'query-asset-info', filePath)) as AssetInfo;
    }

    executePanelMethod(method: string, ...args: any[]) {
        Editor.Message.send(MainName, 'execute-panel-method', method, ...args);
    }

    scanProgress(finished: number, total: number) {
        this.executePanelMethod('scanProgress', ...arguments);
    }

    translateProgress(finished: number, total: number, locale: Intl.BCP47LanguageTag) {
        this.executePanelMethod('translateProgress', ...arguments);
    }

    compileProgress(finished: number, total: number, locale: Intl.BCP47LanguageTag) {
        this.executePanelMethod('compileProgress', ...arguments);
    }

    importProgress(finished: number, total: number, locale: Intl.BCP47LanguageTag) {
        this.executePanelMethod('importProgress', ...arguments);
    }

    async queryDirty(): Promise<boolean> {
        return await Editor.Message.request('scene', 'query-dirty') as boolean;
    }

    async deleteAsset(url: string): Promise<AssetInfo | undefined> {
        if (url && !url.startsWith('db://')) {
            url = `db://${url}`;
        }
        try {
            return await Editor.Message.request('asset-db', 'delete-asset', url) as AssetInfo;
        } catch (e) {
            return undefined;
        }
    }

    async refreshAssets(url?: string): Promise<void> {
        if (url && !url.startsWith('db://')) {
            url = `db://${url}`;
        }
        await Editor.Message.request('asset-db', 'refresh-asset', url ?? 'db://assets');
    }

    softReload() {
        Editor.Message.send('scene', 'soft-reload');
    }

    reImport(url: string): void {
        Editor.Message.send('asset-db', 'reimport-asset', url);
    }

    openPanel() {
        Editor.Panel.open(MainName);
    }

    closePanel() {
        Editor.Panel.close(MainName);
    }

    async queryIsReady(): Promise<boolean> {
        return await Editor.Message.request('scene', 'query-is-ready');
    }

    async queryCurrentScene(): Promise<string> {
        return await Editor.Message.request('scene', 'query-current-scene');
    }
}
