import { merge } from 'lodash';

import { IFloatWindowConfig, IGraphConfigs } from './internal';
import { PACKAGE_JSON, PACKAGE_NAME } from '../global-exports';
import { BaseMgr } from './base-mgr';
import { getFloatWindowConfigByName } from '../../panels/shader-graph/components/float-window';

const CONFIG_KEY = 'shader-graph.graph-configs';

/**
 * 用于处理 shader-graph 配置存储
 */
export class GraphConfigMgr extends BaseMgr {

    static _instance: GraphConfigMgr | null = null;

    public static get Instance(): GraphConfigMgr {
        if (!this._instance) {
            this._instance = new GraphConfigMgr();
        }
        return this._instance;
    }

    private uuid = '';
    private floatWindows: { [key: string]: HTMLElement } = {};
    private graphConfigs: IGraphConfigs = {};

    protected getFloatingWindowConfig(name: string, floatWindowConfig: IFloatWindowConfig): IFloatWindowConfig {
        const { top, left, right, bottom, width, height } = this.floatWindows[name].style;
        const show = (this.floatWindows[name].getAttribute('hidden') === null);

        floatWindowConfig = floatWindowConfig || {};
        if (!floatWindowConfig.position) {
            floatWindowConfig.position = {};
        }

        if (left) {
            floatWindowConfig.position.left = left;
        } else {
            delete floatWindowConfig.position.left;
        }

        if (right) {
            floatWindowConfig.position.right = right;
        } else {
            delete floatWindowConfig.position.right;
        }

        if (top) {
            floatWindowConfig.position.top = top;
        } else {
            delete floatWindowConfig.position.top;
        }

        if (bottom) {
            floatWindowConfig.position.bottom = bottom;
        } else {
            delete floatWindowConfig.position.bottom;
        }

        if (Object.keys(floatWindowConfig.position).length === 0) {
            delete floatWindowConfig.position;
        }

        floatWindowConfig.show = show;
        floatWindowConfig.width = width;
        floatWindowConfig.height = height;

        return floatWindowConfig;
    }

    protected getConfig(uuid?: string) {
        return this.graphConfigs[uuid || this.uuid] || { offset: { x: 0, y: 0 }, scale: 1, floatWindows: {} };
    }

    public async load() {
        this.uuid = await Editor.Profile.getConfig(PACKAGE_JSON.name, 'asset-uuid', 'local');
        this.graphConfigs = await Editor.Profile.getConfig(PACKAGE_JSON.name, CONFIG_KEY, 'local') || {};
        console.debug('load config: ', this.uuid, this.graphConfigs);
    }

    public async delete(uuid?: string) {
        delete this.graphConfigs[uuid || this.uuid];
        await Editor.Profile.setConfig(PACKAGE_JSON.name, CONFIG_KEY, this.graphConfigs, 'local');
    }

    public async sync() {
        this.graphForge.setGraphInfo(await this.getConfig());
    }

    public async autoSave(assetUuid?: string ) {
        const uuid = assetUuid || this.uuid;
        const graphConfig = this.getConfig(uuid);
        const graphInfo = this.graphForge.getGraphInfo();
        graphConfig.scale = graphInfo.scale;
        graphConfig.offset = graphInfo.offset;
        for (const name in this.floatWindows) {
            const config = getFloatWindowConfigByName(name);
            if (!config?.dontSave) {
                graphConfig.floatWindows[name] = this.getFloatingWindowConfig(name, graphConfig.floatWindows[name]);
            }
            if (graphConfig.floatWindows[name] && 0 === Object.keys(graphConfig.floatWindows[name]).length) {
                delete graphConfig.floatWindows[name];
            }
        }
        this.graphConfigs[uuid] = graphConfig;
        console.debug('Auto save config: ', uuid, this.graphConfigs);
        await Editor.Profile.setConfig(PACKAGE_JSON.name, CONFIG_KEY, this.graphConfigs, 'local');
    }

    public getFloatingWindowConfigByName(name: string): IFloatWindowConfig {
        return this.getConfig().floatWindows[name];
    }

    public async saveDetails(name: string, details: { [key: string]: any}) {
        const graphConfig = this.getConfig();
        graphConfig.floatWindows[name] = merge({}, graphConfig.floatWindows[name], details);
        this.graphConfigs[this.uuid] = graphConfig;
        await Editor.Profile.setConfig(PACKAGE_NAME, CONFIG_KEY, this.graphConfigs, 'local');
    }

    public addFloatWindow(name: string, floatWindow: HTMLElement) {
        this.floatWindows[name] = floatWindow;
    }
}
