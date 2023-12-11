import yaml from 'js-yaml';
import { debounce } from 'lodash';

import type { GraphData, PinData, BlockData } from '../../block-forge/interface';
import type { PropertyData } from '../interface';
import type { BlockTemplateData } from '../internal';

import { getBlockDataByType, getBlockTemplateByType } from '../declare';
import { generateUUID, HTMLGraphForgeElement } from '../../block-forge';

import { BaseMgr, MessageMgr, MessageType, MaskMgr, GraphConfigMgr, IGraphConfig } from './index';
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import { getName } from '../utils';

/**
 * 用于处理 shader-graph 数据
 */
export class GraphDataMgr extends BaseMgr {

    static _instance: GraphDataMgr | null = null;

    public static get Instance(): GraphDataMgr {
        if (!this._instance) {
            this._instance = new GraphDataMgr();
        }
        return this._instance;
    }

    public static async createDefaultShaderGraph(type = 'SurfaceMasterNode', graphType = 'Graph', graphName = 'New Shader Graph') {
        switch (type) {
            case 'Surface':
                type = 'SurfaceMasterNode';
                break;
            case 'Unlit':
                type = 'UnlitMasterNode';
                break;
        }

        const graphGraphData: GraphData = {
            type: graphType,
            name: graphName,
            nodes: {},
            graphs: {},
            lines: {},
            details: {
                properties: [],
            },
        };
        const blockData = await getBlockDataByType(type);
        if (!blockData) {
            console.log(`create default shader graph failed, MasterNode: ${type}`);
        } else {
            blockData.position = { x: 347, y: -280 };
            graphGraphData.nodes[generateUUID()] = blockData;
        }
        return yaml.dump(graphGraphData);
    }

    /**
     * 表示是否设置 Graph
     * @private
     */
    protected _dirty = false;

    // 图数据
    protected lastGraphData: GraphData | undefined;
    public graphData: GraphData | null = null;

    /**
     * 存储面板一些主要配置
     * 例如缩放，偏移
     * @private
     */
    private graphConfig: IGraphConfig | undefined = undefined;

    public setDirty(val: boolean, type?: string) {
        this._dirty = val;
        MessageMgr.Instance.send(MessageType.DirtyChanged, val, type);
    }
    public getDirty() {
        return this._dirty;
    }

    private onAssetLoadedBind?: (uuid: string) => void;
    private onDirtyDebounce?: (event: Event) => void;
    private onEnterGraphBind?: () => void;

    release() {
        if (this.onDirtyDebounce) {
            this.graphForge.removeEventListener('dirty', this.onDirtyDebounce);
            this.graphForge.removeEventListener('undo', this.onDirtyDebounce);
            this.graphForge.removeEventListener('redo', this.onDirtyDebounce);
            MessageMgr.Instance.register(MessageType.Dirty, this.onDirtyDebounce);
        }
        this.onEnterGraphBind && this.graphForge.removeEventListener('enter-graph', this.onEnterGraphBind);
        this.onAssetLoadedBind && MessageMgr.Instance.unregister(MessageType.AssetLoaded, this.onAssetLoadedBind);
    }

    public setGraphForge(forge: HTMLGraphForgeElement) {
        super.setGraphForge(forge);
        this.onDirtyDebounce = debounce(this.onDirty.bind(this), 100);
        forge.addEventListener('dirty', this.onDirtyDebounce);
        forge.addEventListener('undo', this.onDirtyDebounce);
        forge.addEventListener('redo', this.onDirtyDebounce);

        this.onEnterGraphBind = this.onEnterGraph.bind(this);
        forge.addEventListener('enter-graph', this.onEnterGraphBind);

        this.onAssetLoadedBind = this.onAssetLoaded.bind(this);
        MessageMgr.Instance.register(MessageType.AssetLoaded, this.onAssetLoadedBind);
        MessageMgr.Instance.register(MessageType.Dirty, this.onDirtyDebounce);
    }

    private reset() {
        this.setDirty(false);
    }

    private onAssetLoaded() {
        this.reset();
        this.reload();
    }

    private onDirty(event: Event) {
        if (!this.graphForge) return;

        GraphConfigMgr.Instance.autoSave().then(() => {});
        const customEvent = event as CustomEvent;
        this.setDirty(true, customEvent && customEvent.detail?.dirtyType);
    }

    public onEnterGraph() {
        if (!this.graphForge) return;

        this.graphData = this.graphForge.getCurrentGraph();
        MessageMgr.Instance.send(MessageType.EnterGraph);
    }

    public async restore() {
        if (this.lastGraphData) {
            this.setGraphDataToForge(this.lastGraphData);
        }
        this.graphData = this.graphForge.getCurrentGraph();
        this.lastGraphData = JSON.parse(JSON.stringify(this.graphData));

        this.setDirty(false);

        MessageMgr.Instance.send(MessageType.Restore);
    }

    public setGraphDataByAsset(assetInfo: AssetInfo, asset: string) {
        if (!this.graphForge) return;

        if (asset) {
            this.graphData = this.validateGraphData(assetInfo, this.graphForge.deserialize(asset));
        } else {
            console.warn('reload failed, graph data asset is null.');
            return;
        }
    }

    public async reload() {
        if (!this.graphForge || !this.graphData) return;

        this.lastGraphData = JSON.parse(JSON.stringify(this.graphData));
        this.setGraphDataToForge(this.graphData);

        await GraphConfigMgr.Instance.sync();
        MaskMgr.Instance.hideAll();
        MessageMgr.Instance.send(MessageType.SetGraphDataToForge);
    }

    public syncLastGraphData() {
        this.lastGraphData = JSON.parse(JSON.stringify(this.graphData));
    }

    /**
     * 存储到 Asset 的字符串数据
     */
    public getGraphAssetData(): string {
        if (!this.graphForge) return '';

        return this.graphForge.serialize();
    }

    /**
     * 还原成原始节点
     * @private
     */
    public reduceToBaseNode(property: PropertyData) {
        const graphData = this.getCurrentGraphData();
        for (const nodeID in graphData.nodes) {
            const node: BlockData = graphData.nodes[nodeID];
            const details = node && node.details;
            if (!details) continue;

            if (details && details.propertyID === property.id) {
                details.title = property.name;
                details.outputPins = property.outputPins;
                // 重置
                const block = getBlockTemplateByType(details.baseType);
                node.type = details.baseType;

                const inputPins: PinData[] = [];
                block?.data.details.inputPins?.forEach((pin: PinData, index: number) => {
                    const rawPinData = details.inputPins?.[index];
                    if (rawPinData) {
                        pin.value = rawPinData.value;
                    }
                    inputPins.push(pin);
                });
                node.details.inputPins = inputPins;

                const outputPins: PinData[] = [];
                block?.data.details.outputPins?.forEach((pin: PinData, index: number) => {
                    const rawPinData = details.outputPins?.[index];
                    if (rawPinData) {
                        pin.value = rawPinData.value;
                    }
                    outputPins.push(pin);
                });
                node.details.outputPins = outputPins;
            }
        }
        this.setGraphDataToForge(graphData);
    }

    /**
     * 验证数据
     * @private
     */
    protected validateGraphData(assetInfo: AssetInfo, graphData: GraphData) {
        let dirty = false;

        const newName = getName(assetInfo.path);
        if (graphData.name !== newName) {
            graphData.name = newName;
            dirty = true;
        }

        for (const uuid in graphData.nodes) {
            const block: BlockData = graphData.nodes[uuid];
            const blockTemplate: BlockTemplateData | undefined = getBlockTemplateByType(block.type);
            if (blockTemplate) {
                // 1.新增 slot 需要补全数据
                const inputPins = block.details.inputPins;
                if (inputPins && blockTemplate.data.details.inputPins) {
                    blockTemplate.data.details.inputPins.forEach((pin: PinData, index: number) => {
                        const inputPinData: PinData | undefined = inputPins[index];
                        if (!inputPinData) {
                            inputPins[index] = pin;
                            dirty = true;
                        }
                    });
                }
            }
        }
        // 初始化
        if (!graphData.details.properties) {
            graphData.details.properties = [];
        }
        if (dirty && this.graphForge) {
            Editor.Message.request('asset-db', 'save-asset', assetInfo.uuid, this.graphForge.serialize(graphData));
        }
        return graphData;
    }
}

