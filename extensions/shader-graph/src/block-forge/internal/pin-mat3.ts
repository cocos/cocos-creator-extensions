'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

/**
 * Vec4
 * 布尔类型的引脚
 */
type Mat3KeyList = [
    'm00', 'm01', 'm02',
    'm03', 'm04', 'm05',
    'm06', 'm07', 'm08',
];
const mat3KeyList: Mat3KeyList = [
    'm00', 'm01', 'm02',
    'm03', 'm04', 'm05',
    'm06', 'm07', 'm08',
];

type Mat3Detail = {
    value: {
        m00: number, m01: number, m02: number,
        m03: number, m04: number, m05: number,
        m06: number, m07: number, m08: number,
    };
}

class Mat3PinAction extends PinAction<{
    key: keyof Mat3Detail['value'],
    source: number,
    target: number,
}> {

    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        const $pin = params.forge.getPinElement(this.detail.blockName, 'input', this.detail.index);
        if ($pin) {
            // @ts-ignore
            const pin = $pin.__pin as Mat2Pin;
            pin.details.value[this.detail.key] = this.detail.target;
            pin.onUpdate();
        }
    }

    revertAction() {
        return new Mat3PinAction(this.pin, {
            key: this.detail.key,
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

class Mat3Pin extends Pin<Mat3Detail> {
    static type = 'mat3';

    color = '#c56c37';
    line = 'normal';
    details = {
        value: {
            m00: 0, m01: 0, m02: 0,
            m03: 0, m04: 0, m05: 0,
            m06: 0, m07: 0, m08: 0,
        },
    };

    contentSlot = /*html*/``;
    childrenSlot = [
        /*html*/`<ui-num-input ref="m00"></ui-num-input><ui-num-input ref="m01"></ui-num-input><ui-num-input ref="m02"></ui-num-input>`,
        /*html*/`<ui-num-input ref="m03"></ui-num-input><ui-num-input ref="m04"></ui-num-input><ui-num-input ref="m05"></ui-num-input>`,
        /*html*/`<ui-num-input ref="m06"></ui-num-input><ui-num-input ref="m07"></ui-num-input><ui-num-input ref="m08"></ui-num-input>`,
    ];

    style = `
.mat3 .slot-children { display: flex; }
.mat3 .slot-children > * { padding: 0 2px;}
.mat3 .slot-children ui-num-input { flex: 1; width: 0; color: white; }
    `;

    onInit() {
        mat3KeyList.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';

            this.refs[key].addEventListener('confirm', () => {
                if (!this.details) {
                    this.details = {
                        value: {
                            m00: 0, m01: 0, m02: 0,
                            m03: 0, m04: 0, m05: 0,
                            m06: 0, m07: 0, m08: 0,
                        },
                    };
                }

                const action = new Mat3PinAction(this, {
                    key,
                    source: this.details.value[key],
                    target: parseFloat($el.value),
                });
                this.exec(action);
            });
        });
    }

    onUpdate() {
        mat3KeyList.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';
        });
    }
}
declarePin(Mat3Pin);
