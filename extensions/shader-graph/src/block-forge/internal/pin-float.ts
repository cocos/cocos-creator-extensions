'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

type FloatDetail = {
    value: number;
};

class FloatPinAction extends PinAction<{
    source: number,
    target: number,
}> {

    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        const $pin = params.forge.getPinElement(this.detail.blockName, 'input', this.detail.index);
        if ($pin) {
            // @ts-ignore
            const pin = $pin.__pin as FloatPin;
            pin.details.value = this.detail.target;
            pin.onUpdate();
        }
    }

    revertAction() {
        return new FloatPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Float
 * 浮点类型的引脚
 */
class FloatPin extends Pin<FloatDetail> {
    static type = 'float';

    color = '#c171cf';
    line = 'normal';
    details = {
        value: 0,
    };

    contentSlot = /*html*/`<ui-num-input ref="num"></ui-num-input>`;
    childrenSlot = [];

    onInit() {
        const $num = this.refs.num as HTMLInputElement;
        $num.addEventListener('confirm', () => {
            if (!this.details) {
                this.details = {
                    value: parseFloat($num.value),
                };
            }
            const action = new FloatPinAction(this, {
                source: this.details.value,
                target: parseFloat($num.value),
            });
            this.exec(action);
        });
    }

    onUpdate() {
        const $num = this.refs.num as HTMLInputElement;
        $num.value = this.details.value + '';
    }
}
declarePin(FloatPin);
