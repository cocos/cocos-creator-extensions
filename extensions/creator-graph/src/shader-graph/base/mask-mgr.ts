import EventEmitter from 'events';
import { MaskType } from './internal';
import { MessageMgr, MessageType } from './index';

export class MaskMgr extends EventEmitter {

    static _instance: MaskMgr | null = null;

    maskQueue: MaskType[] = [];

    displayMaskType: MaskType = MaskType.WaitLoad;

    get ready() {
        return this.displayMaskType === MaskType.None;
    }

    public static get Instance(): MaskMgr {
        if (!this._instance) {
            this._instance = new MaskMgr();
        }
        return this._instance;
    }

    show(type: MaskType) {
        if (!this.maskQueue.includes(type)) {
            this.maskQueue.push(type);
            this.maskQueue.sort((a: MaskType, b: MaskType) => {
                // 根据枚举值大小进行排序，从大到小
                return b - a;
            });
        }
        this.updateMask();
    }

    hide(type: MaskType) {
        const jumpToNextMask = this.displayMaskType === type;
        const index = this.maskQueue.indexOf(type);
        if (index !== -1) {
            this.maskQueue.splice(index, 1);
        }
        if (jumpToNextMask) {
            this.updateMask();
        }
    }

    hideAll() {
        this.maskQueue = [];
        this.updateMask();
    }

    updateMask() {
        const nextMaskType = this.maskQueue.shift();
        this.displayMaskType = nextMaskType ?? MaskType.None;
        MessageMgr.Instance.send(MessageType.UpdateMask, this.displayMaskType);
    }
}

