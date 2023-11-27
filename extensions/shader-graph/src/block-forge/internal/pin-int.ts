'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import type { BaseElement } from '@itharbors/ui-core';
import { Pin, declarePin, PinAction } from '../pin';

type IntDetail = {
    value: number;
};

class IntPinAction extends PinAction<{
    source: IntDetail['value'],
    target: IntDetail['value'],
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
        return new IntPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Float
 * 浮点类型的引脚
 */
class IntPin extends Pin<IntDetail> {
    static type = 'int';

    color = '#cf71a0';
    line = 'normal';
    details = {
        value: 0,
    };

    contentSlot = /*html*/`<ui-num-input step="1" ref="num"></ui-num-input>`;
    childrenSlot = [];

    onInit() {
        const $num = this.refs.num as HTMLInputElement;
        $num.addEventListener('confirm', () => {
            if (!this.details) {
                this.details = {
                    value: 0,
                };
            }

            const action = new IntPinAction(this, {
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
declarePin(IntPin);
