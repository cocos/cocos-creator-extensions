'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

type Vec4PinDetail = {
    value: {
        x: number,
        y: number,
        z: number,
        w: number,
    };
}

class VecPinAction extends PinAction<{
    key: keyof Vec4PinDetail['value'],
    source: number,
    target: number,
}> {

    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        const $pin = params.forge.getPinElement(this.detail.blockName, 'input', this.detail.index);
    
        if ($pin) {
            // @ts-ignore
            const pin = $pin.__pin as Vec4Pin;
            pin.details.value[this.detail.key] = this.detail.target;
            pin.onUpdate();
        }
    }

    revertAction() {
        return new VecPinAction(this.pin, {
            key: this.detail.key,
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Vec4
 * 布尔类型的引脚
 */
class Vec4Pin extends Pin<Vec4PinDetail> {
    static type = 'vec4';

    color = '#d0c679';
    line = 'normal';
    details = {
        value: {
            x: 0, y: 0,
            z: 0, w: 0,
        },
    };

    contentSlot = /*html*/``;
    childrenSlot = [
        /*html*/`<ui-num-input ref="x" label="x"></ui-num-input><ui-num-input ref="y" label="y">`,
        /*html*/`<ui-num-input ref="z" label="z"></ui-num-input><ui-num-input ref="w" label="w">`,
    ];

    style = `
.vec4 .slot-children { display: flex; }
.vec4 .slot-children > * { padding: 0 2px;}
.vec4 .slot-children ui-num-input { flex: 1; width: 0; color: white; }
    `;

    onInit() {
        const keys: ['x', 'y', 'z', 'w'] = ['x', 'y', 'z', 'w'];
        keys.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';

            this.refs[key].addEventListener('confirm', () => {
                if (!this.details) {
                    this.details = { value: { x: 0, y: 0, z: 0, w: 0 } };
                }
                // this.details.value[key] = parseFloat($el.value);

                const action = new VecPinAction(this, {
                    key,
                    source: this.details.value[key],
                    target: parseFloat($el.value),
                });
                this.exec(action);
            });
        });
    }

    onUpdate() {
        const keys: ['x', 'y', 'z', 'w'] = ['x', 'y', 'z', 'w'];
        keys.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';
        });
    }
}
declarePin(Vec4Pin);
