import EventEmitter from 'events';
import { HTMLGraphForgeElement } from '../../block-forge';
import { GraphData } from '../../block-forge/interface';

export class BaseMgr extends EventEmitter {

    protected _graphForge: HTMLGraphForgeElement | null = null;
    public get graphForge(): HTMLGraphForgeElement {
        return this._graphForge!;
    }

    public setGraphForge(forge: HTMLGraphForgeElement) {
        this._graphForge = forge;
    }

    public getRootGraphData(): GraphData {
        return this.graphForge.rootGraph!;
    }

    public getCurrentGraphData(): GraphData {
        const currentGraphData: GraphData = this.graphForge.getCurrentGraph();
        if (currentGraphData) {
            if (!currentGraphData.details) {
                currentGraphData.details = {};
            }
            if (!Array.isArray(currentGraphData.details.properties)) {
                currentGraphData.details.properties = [];
            }
        }
        return currentGraphData;
    }

    public setGraphDataToForge(graphData: GraphData) {
        this.graphForge.setCurrentGraph(graphData);
    }

    public release() {

    }
}
