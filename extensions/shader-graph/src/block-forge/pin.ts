'use strict';

/**
 * Pin 引脚内置的类型
 */

import type { LineInfo } from '@itharbors/ui-graph';
import type { BaseElement } from '@itharbors/ui-core';
import type { IPinDescription, IBlockDescription, PinData } from './interface';
import type {
    HTMLGraphForgeElement,
} from './forge';

import {
    Action,
    ActionList,
} from '@itharbors/structures';

export type DirtyDetail = {
    action?: Action;
};

const TYPE: {
    [key: string]: new(...args: any[]) => Pin
} = {};

type PinActionDetail = {
    blockName: string;
    index: number;
};

export class PinAction<D extends {}> extends Action<D & PinActionDetail> {

    pin: Pin;

    // details: D & PinActionDetail;

    constructor(pin: Pin, details: D) {
        const cDetails = details as D & PinActionDetail;
        cDetails.blockName = pin.pathData.blockName;
        cDetails.index = pin.pathData.index;
        super(cDetails);
        // this.details = cDetails;
        this.pin = pin;
    }

    exec(params: {
        forge: HTMLGraphForgeElement
    }) {

    }

    revertAction() {
        return new PinAction(this.pin, {});
    }
}

export class Pin<D = { [key: string]: any }> {
    static type = 'unknown';

    color = 'white';
    line = '';
    style = '';
    details?: D;

    pathData = {
        blockName: '',
        index: 0,
    };

    desc!: IPinDescription;

    contentSlot?: string;
    childrenSlot?: string[];

    refs: { [key: string]: HTMLElement } = {};
    $root?: HTMLElement;

    init(details: D, desc: IPinDescription, blockName: string, index: number) {
        this.details = details;
        this.pathData.blockName = blockName;
        this.pathData.index = index;
        this.desc = desc;
    }

    exec(action: Action) {
        if (!this.$root) {
            return;
        }
        const nodeRoot = this.$root.getRootNode() as ShadowRoot;
        if (nodeRoot) {
            (nodeRoot.host as BaseElement).dispatch('dirty', {
                detail: {
                    action,
                },
            });
        }
    }

    onInit() {

    }

    onUpdate() {

    }
}

// todo 考虑数据冲突

function generateIcon(pin: IPinDescription) {
    if (pin.icon) {
        return /*html*/`<ui-icon value="${pin.icon}"></ui-icon>`;
    }
    return '';
}

function generateTitle(pin: IPinDescription) {
    if (pin.name) {
        return /*html*/`<span class="name" title="${pin.name}">${pin.name}</span>`;
    }
    return '';
}

/**
 * 生成 output pin 的 HTML
 * @param pin
 * @param details
 * @returns
 */
export function generateOutputPinHTML(pin: IPinDescription, details: { value: any }) {
    const type = pin.dataType as keyof typeof TYPE;
    const define = TYPE[type] || TYPE['unknown'];
    const pinI = new define();
    const color = pinI.color ? `--param-color: ${pinI.color};` : '';

    const $pin = document.createElement('div');
    $pin.classList.add('pin');
    $pin.classList.add('out');
    $pin.classList.add(type + '');

    // @ts-ignore
    $pin.__pin = pinI;

    $pin.innerHTML = /*html*/`${pinI.style ? `<style>${pinI.style}</style>` : ''}
    <div class="body">
        <div class="name">
            ${generateTitle(pin)}
            ${generateIcon(pin)}
        </div>
    </div>

    <v-graph-node-param ${pin.hidePin ? 'hidden' : ''} style="${color}" class="point" direction="output" name="${pin.tag}" type="${type}" role="right"></v-graph-node-param>`;

    const $refList = $pin.querySelectorAll('[ref]');
    Array.prototype.forEach.call($refList, ($ref) => {
        const ref = $ref.getAttribute('ref');
        if (ref) {
            pinI.refs[ref] = $ref;
        }
    });

    pinI.details = details;
    // pinI.onInit();
    // pinI.onUpdate(details);
    return $pin;
}

/**
 * 生成 input pin 的 HTML
 * @param pin
 * @param pinData
 * @param blockName
 * @param lineMap
 * @returns
 */
export function generateInputPinHTML(pin: IPinDescription, pinDataList: PinData[], index: number, blockName: string, lineMap: { [key: string]: LineInfo | undefined }) {
    const type = pin.dataType as keyof typeof TYPE;
    const define = TYPE[type] || TYPE['unknown'];
    const pinI = new define();
    const color = pinI.color ? `--param-color: ${pinI.color};` : '';

    let connected = false;
    for (const id in lineMap) {
        const line = lineMap[id];
        if (
            line &&
            line.output.node === blockName &&
            line.output.param === pin.tag
        ) {
            connected = true;
        }
    }

    const $pin = document.createElement('div');
    $pin.classList.add('pin');
    $pin.classList.add('in');
    $pin.classList.add(type + '');

    // @ts-ignore
    $pin.__pin = pinI;

    $pin.innerHTML = /*html*/`${pinI.style ? `<style>${pinI.style}</style>` : ''}
    <div class="body">
        <div class="name">
            ${generateIcon(pin)}
            ${generateTitle(pin)}
        </div>
        ${pinI.contentSlot ? `<div class="slot-content" ${connected ? 'hidden' : ''}>${pinI.contentSlot}</div>` : ''}
    </div>

    ${pinI.childrenSlot ? `<div class="children" ${connected ? 'hidden' : ''}>${pinI.childrenSlot.map(child => '<div class="slot-children">' + child + '</div>').join('')}</div>` : ''}
    <v-graph-node-param ${pin.hidePin ? 'hidden' : ''} style="${color}" class="point" direction="input" name="${pin.tag}" type="${type}" role="left"></v-graph-node-param>`;

    const $refList = $pin.querySelectorAll('[ref]');
    Array.prototype.forEach.call($refList, ($ref) => {
        const ref = $ref.getAttribute('ref');
        if (ref) {
            pinI.refs[ref] = $ref;
        }
    });

    const pinData = pinDataList[index];

    pinI.init(pinData, pin, blockName, index);
    pinI.$root = $pin;
    pinI.onInit();
    pinI.onUpdate();
    return $pin;
}

/**
 * 生成 pin 的样式代码
 * @param config
 * @returns
 */
export function generateStyle(blockDesc: IBlockDescription) {
    return /*css*/`
.pin {
    --param-color: #fff;
    --line—margin: 6px;

    line-height: calc(var(--header-height) - 4px);
    margin: var(--line—margin) 10px 0 10px;
    position: relative;
}
.pin:last-child {
    padding-bottom: var(--line—margin);
}
.pin.in {

}
.pin.out {
    text-align: right;
}
.pin.in > .point[hidden], .pin.out > .point[hidden] {
    display: none;
}

.pin.in > .point, .pin.out > .point {
    display: block;
    border: 1px solid var(--param-color);
    transform: rotate(45deg);
    width: 7px;
    height: 7px;
    position: absolute;
    top: 6px;
    transition: all 0.2s;
    background: var(--background-color);
    z-index: 1;
    cursor: pointer;
}
.pin.in > .point {
    left: -14px;
}
.pin.out > .point {
    right: -14px;
}
.pin.in > .point:hover,
.pin.in > .point[active],
.pin.out > .point:hover,
.pin.out > .point[active]
{
    background: var(--param-color);
}

.pin > .body {
    display: flex;
}
.pin > .body > .name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.pin > .body > .name > .name {
    padding: 0 6px;
}

.pin > .body > .slot-content {
    flex: 1;
    display: flex;
    width: 120px;
}

.pin > .children, .pin > .children > div {
    margin-top: calc(var(--line—margin) * 0.5);
}

.pin > .body > .slot-content[hidden], .pin > .children[hidden] {
    display: none;
}
    `;
}

export function declarePin(define: new(...args: any[]) => Pin) {
    const type = (define as unknown as typeof Pin).type;
    TYPE[type] = define;
}
