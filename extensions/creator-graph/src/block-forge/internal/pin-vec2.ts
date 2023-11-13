'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

type Vec2PinDetail = {
    value: {
        x: number,
        y: number,
    };
}

class Vec2PinAction extends PinAction<{
    key: keyof Vec2PinDetail['value'],
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
        return new Vec2PinAction(this.pin, {
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
class Vec2Pin extends Pin<Vec2PinDetail> {
    static type = 'vec2';

    color = '#D07979';
    line = 'normal';
    details = {
        value: {
            x: 0, y: 0,
        },
    };

    contentSlot = /*html*/``;
    childrenSlot = [
        /*html*/`<ui-num-input ref="x" label="x"></ui-num-input><ui-num-input ref="y" label="y"></ui-num-input>`,
    ];

    style = `
.vec2 .slot-children { display: flex; }
.vec2 .slot-children > * { padding: 0 2px;}
.vec2 .slot-children ui-num-input { flex: 1; width: 0; color: white; }
    `;

    onInit() {
        const keys: ['x', 'y'] = ['x', 'y'];
        keys.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';

            this.refs[key].addEventListener('confirm', () => {
                if (!this.details) {
                    this.details = { value: { x: 0, y: 0 } };
                }
                // this.details.value[key] = parseFloat($el.value);

                const action = new Vec2PinAction(this, {
                    key,
                    source: this.details.value[key],
                    target: parseFloat($el.value),
                });
                this.exec(action);
            });
        });
    }

    onUpdate() {
        const keys: ['x', 'y'] = ['x', 'y'];
        keys.forEach((key) => {
            const $el = this.refs[key] as HTMLInputElement;
            $el.value = this.details.value[key] + '';
        });
    }
}
declarePin(Vec2Pin);
