import { BaseMgr } from './index';
import { Forge } from '../../block-forge';

/**
 * 用于把 shader-graph 数据转成具体的对象，方便操作跟获取，主要是二次封装 Forge 这个类
 */
export class ForgeMgr extends BaseMgr {

    static _instance: ForgeMgr | null = null;

    public static get Instance(): ForgeMgr {
        if (!this._instance) {
            this._instance = new ForgeMgr();
        }
        return this._instance;
    }

    private _forge: Forge | null = null;
    private get forge(): Forge {
        this._forge = new Forge(this.graphForge.getRootGraph()!);
        return this._forge;
    }

    public getGraph() {
        return this.forge.getGraph();
    }

    public getBlockMap() {
        return this.getGraph().getBlockMap();
    }

    public getBlockByUuid(uuid: string) {
        return this.getBlockMap()[uuid];
    }

    release() {

    }
}
