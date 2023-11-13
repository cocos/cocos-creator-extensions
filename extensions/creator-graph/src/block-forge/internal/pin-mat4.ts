'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

/**
 * Vec4
 * 布尔类型的引脚
 */
type Mat4KeyList = [
    'm00', 'm01', 'm02', 'm03',
    'm04', 'm05', 'm06', 'm07',
    'm08', 'm09', 'm10', 'm11',
    'm12', 'm13', 'm14', 'm15',
];
const mat4KeyList: Mat4KeyList = [
    'm00', 'm01', 'm02', 'm03',
    'm04', 'm05', 'm06', 'm07',
    'm08', 'm09', 'm10', 'm11',
    'm12', 'm13', 'm14', 'm15',
];

type Mat4Detail = {
    value: {
        m00: number, m01: number, m02: number, m03: number,
        m04: number, m05: number, m06: number, m07: number,
        m08: number, m09: number, m10: number, m11: number,
        m12: number, m13: number, m14: number, m15: number,
    };
}

class Mat4PinAction extends PinAction<{
    key: keyof Mat4Detail['value'],
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
        return new Mat4PinAction(this.pin, {
            key: this.detail.key,
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

class Mat4Pin extends Pin<Mat4Detail> {
    static type = 'mat4';

    color = '#c5ae37';
    line = 'normal';
    details = {
        value: {
            m00: 0, m01: 0, m02: 0, m03: 0,
            m04: 0, m05: 0, m06: 0, m07: 0,
            m08: 0, m09: 0, m10: 0, m11: 0,
            m12: 0, m13: 0, m14: 0, m15: 0,
        },
    };

    contentSlot = /*html*/``;
    childrenSlot = [
        /*html*/`<ui-num-input ref="m00"></ui-num-input><ui-num-input ref="m01"></ui-num-input><ui-num-input ref="m02"></ui-num-input><ui-num-input ref="m03"></ui-num-input>`,
        /*html*/`<ui-num-input ref="m04"></ui-num-input><ui-num-input ref="m05"></ui-num-input><ui-num-input ref="m06"></ui-num-input><ui-num-input ref="m07"></ui-num-input>`,
        /*html*/`<ui-num-input ref="m08"></ui-num-input><ui-num-input ref="m09"></ui-num-input><ui-num-input ref="m10"></ui-num-input><ui-num-input ref="m11"></ui-num-input>`,
        /*html*/`<ui-num-input ref="m12"></ui-num-input><ui-num-input ref="m13"></ui-num-input><ui-num-input ref="m14"></ui-num-input><ui-num-input ref="m15"></ui-num-input>`,
    ];

    style = `
.mat4 .slot-children { display: flex; }
.mat4 .slot-children > * { padding: 0 2px;}
.mat4 .slot-children ui-num-input { flex: 1; width: 0; color: white; }
    `;

    onInit() {
        mat4KeyList.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';

            this.refs[key].addEventListener('confirm', () => {
                if (!this.details) {
                    this.details = {
                        value: {
                            m00: 0, m01: 0, m02: 0, m03: 0,
                            m04: 0, m05: 0, m06: 0, m07: 0,
                            m08: 0, m09: 0, m10: 0, m11: 0,
                            m12: 0, m13: 0, m14: 0, m15: 0,
                        },
                    };
                }
                const action = new Mat4PinAction(this, {
                    key,
                    source: this.details.value[key],
                    target: parseFloat($el.value),
                });
                this.exec(action);
            });
        });
    }

    onUpdate() {
        mat4KeyList.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';
        });
    }
}
declarePin(Mat4Pin);
