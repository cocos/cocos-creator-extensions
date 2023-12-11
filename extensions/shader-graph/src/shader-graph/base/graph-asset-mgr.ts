import { join } from 'path';
import { existsSync, readFileSync } from 'fs-extra';

import type { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';

import { MaskType } from './internal';

import { DEFAULT_NAME, PACKAGE_JSON, PROJECT_PATH } from '../global-exports';
import { convertToProjectDbUrl, getAssetUuidByPath, getName } from '../utils';
import { GraphConfigMgr, GraphDataMgr, MessageMgr, MessageType, MaskMgr } from './index';
import { declareGraphBlock } from '../declare';

/**
 * 用于处理 shader-graph Asset 资源的存储
 */
export class GraphAssetMgr {

    static _instance: GraphAssetMgr | null = null;

    public static get Instance(): GraphAssetMgr {
        if (!this._instance) {
            this._instance = new GraphAssetMgr();
        }
        return this._instance;
    }

    private assetUuid = '';
    private assetData = '';
    private shaderGraphAssetInfo: AssetInfo | null = null;

    get uuid(): string {
        return this.assetUuid || '';
    }

    public async openAsset() {
        await GraphConfigMgr.Instance.load();

        const isReady = await MessageMgr.Instance.checkSceneReady();
        if (isReady) {
            MaskMgr.Instance.show(MaskType.WaitLoad);
            await declareGraphBlock();
            await this.load();
        } else {
            MessageMgr.Instance.setSceneReady(false);
            MaskMgr.Instance.show(MaskType.WaitSceneReady);
        }
    }

    public async load(uuid?: string | undefined): Promise<boolean> {
        uuid = uuid || await Editor.Profile.getConfig(PACKAGE_JSON.name, 'asset-uuid', 'local');
        if (!uuid) {
            MaskMgr.Instance.show(MaskType.NeedCreateNewAsset);
            return false;
        }
        this.assetUuid = uuid;
        this.shaderGraphAssetInfo = await Editor.Message.request('asset-db', 'query-asset-info', uuid);
        if (!this.shaderGraphAssetInfo && GraphDataMgr.Instance.getGraphAssetData()) {
            MaskMgr.Instance.show(MaskType.AssetMissing);
            return false;
        }

        if (this.shaderGraphAssetInfo) {
            this.assetData = readFileSync(this.shaderGraphAssetInfo.file, 'utf8');
            GraphDataMgr.Instance.setGraphDataByAsset(this.shaderGraphAssetInfo, this.assetData);
        } else {
            this.assetData = '';
        }

        if (!this.assetData) {
            MaskMgr.Instance.show(MaskType.NeedCreateNewAsset);
            return false;
        }
        MaskMgr.Instance.hide(MaskType.AssetMissing);
        MaskMgr.Instance.hide(MaskType.NeedCreateNewAsset);
        MessageMgr.Instance.send(MessageType.AssetLoaded);
        return true;
    }

    /**
     * 打开指定 Shader Graph 资源
     */
    public async open(): Promise<boolean> {
        try {
            const result = await Editor.Dialog.select({
                title: Editor.I18n.t('shader-graph.messages.titles.open'),
                path: PROJECT_PATH,
                type: 'file',
                multi: false,
                filters: [{ name: 'Shader Graph', extensions: ['shadergraph'] }],
            });

            const uuid = await getAssetUuidByPath(result.filePaths[0]);
            await Editor.Profile.setConfig(PACKAGE_JSON.name, 'asset-uuid', uuid, 'local');
            return await this.load(uuid);
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * 新建 Shader Graph 资源
     */
    public async createNew(type: string): Promise<boolean> {
        try {
            const result = await Editor.Dialog.save({
                title: Editor.I18n.t('shader-graph.messages.save.title'),
                path: join(Editor.Project.path, 'assets', 'New Shader Graph'),
                filters: [{
                    name: 'New Shader Graph',
                    extensions: ['shadergraph'],
                }],
            });

            const url = convertToProjectDbUrl(result.filePath);
            const defaultShaderGraph = await GraphDataMgr.createDefaultShaderGraph(type);
            const asset = await this.createAsset(url, defaultShaderGraph);
            if (asset) {
                return await this.load(asset.uuid);
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * 保存
     */
    public async save(): Promise<boolean> {
        try {
            if (!this.shaderGraphAssetInfo) return false;
            GraphDataMgr.Instance.syncLastGraphData();
            console.time('save');
            Editor.Message.request('asset-db', 'save-asset', this.shaderGraphAssetInfo.uuid, GraphDataMgr.Instance.getGraphAssetData()).then(() => {
                console.timeEnd('save');
            });
            GraphDataMgr.Instance.setDirty(false);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * 另存为
     */
    public async saveAs(): Promise<boolean> {
        try {
            const result = await Editor.Dialog.save({
                title: Editor.I18n.t('shader-graph.messages.save.title'),
                path: join(Editor.Project.path, 'assets', this.shaderGraphAssetInfo?.name || DEFAULT_NAME),
                filters: [{
                    name: 'Shader Graph',
                    extensions: ['shadergraph'],
                }],
            });

            const url = convertToProjectDbUrl(result.filePath);
            if (!url) {
                console.debug('另存 Shader Graph 资源失败, 保存的 url 为 null');
                return false;
            }

            const asset = await this.createAsset(url, GraphDataMgr.Instance.getGraphAssetData());
            if (asset) {
                return await this.load(asset.uuid);
            }
            return false;
        } catch (e) {
            console.error('保存失败!', e);
            return false;
        }
    }

    /**
     * 检查是否需要保存
     */
    public async checkIfSave(): Promise<boolean> {
        if (this.shaderGraphAssetInfo && !existsSync(this.shaderGraphAssetInfo.file)) {
            const result = await Editor.Dialog.warn(Editor.I18n.t('shader-graph.messages.missing_assets.detail'), {
                title: Editor.I18n.t('shader-graph.messages.titles.normal'),
                default: 0,
                cancel: 1,
                buttons: [
                    Editor.I18n.t('shader-graph.buttons.save'),
                    Editor.I18n.t('shader-graph.buttons.unsaved'),
                ],
            });
            if (0 === result.response) {
                // 另存为
                return await this.saveAs();
            }
            return false;
        } else {
            const result = await Editor.Dialog.warn(Editor.I18n.t('shader-graph.messages.save.detail'), {
                title: Editor.I18n.t('shader-graph.messages.titles.normal'),
                default: 0,
                cancel: 1,
                buttons: [
                    Editor.I18n.t('shader-graph.buttons.save'),
                    Editor.I18n.t('shader-graph.buttons.unsaved'),
                ],
            });
            if (0 === result.response) {
                // 另存为
                return await this.save();
            }
            return false;
        }
    }

    protected async createAsset(url: string | undefined, content: string | undefined): Promise<AssetInfo | undefined> {
        try {
            if (!url || !content) return;

            // 强制覆盖
            return await Editor.Message.request('asset-db', 'create-asset', url, content, { overwrite: true }) as AssetInfo;
        } catch (e) {
            console.error(e);
        }
    }

    public assetAdd(uuid: string, info: AssetInfo) {
        if (info && info.importer) {
            MessageMgr.Instance.callSceneMethod('registerEffects', [uuid]);
        }
    }

    public async assetDelete(uuid: string, info: AssetInfo) {
        if (info && info.importer) {
            MessageMgr.Instance.callSceneMethod('removeEffects', [uuid]);
        }
        if (this.uuid === uuid) {
            await GraphConfigMgr.Instance.delete(uuid);
            MaskMgr.Instance.show(MaskType.AssetMissing);
        }
    }

    public assetChange(uuid: string, info: AssetInfo) {

        if (info && info.importer) {
            MessageMgr.Instance.callSceneMethod('updateEffect', [uuid]);
        }

        if (this.uuid === uuid && GraphDataMgr.Instance.graphForge && GraphDataMgr.Instance.graphData) {
            try {
                // 更新名字
                const newName = getName(info.name);
                const needToRename = GraphDataMgr.Instance.graphForge.getCurrentGraph().name !== newName;

                const dirty = GraphDataMgr.Instance.getDirty();
                if (dirty && needToRename) {
                    MaskMgr.Instance.show(MaskType.NeedSaveBeReloadByRename);
                    return;
                }

                if (dirty) return;

                if (needToRename) {
                    this.load();
                    return;
                }

                // const baseData = readFileSync(info.file, 'utf8');
                // const conflictA = this.graphForge.serialize() !== baseData;
                // const conflictB = this.graphForge.serialize(this.graphData) !== baseData;
                //
                // if (conflictA && conflictB) {
                //     MaskMgr.Instance.show(MaskType.AssetChange);
                // }
            } catch (e) {
                console.error(e);
            }
        }
    }
}
