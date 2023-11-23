'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

type BooleanDetail = {
    value: boolean;
};

class BooleanPinAction extends PinAction<{
    source: boolean,
    target: boolean,
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
        return new BooleanPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Boolean
 * 布尔类型的引脚
 */
class BooleanPin extends Pin<BooleanDetail> {
    static type = 'boolean';

    color = '#227f9b';
    line = 'normal';
    details = {
        value: false,
    };

    contentSlot = /*html*/`<ui-checkbox ref="checkbox"></ui-checkbox>`;
    childrenSlot = [];

    onInit() {
        const $checkbox = this.refs.checkbox as HTMLInputElement;
        $checkbox.addEventListener('confirm', () => {
            if (!this.details) {
                this.details = {
                    value: !!$checkbox.value,
                };
            }
            const action = new BooleanPinAction(this, {
                source: this.details.value,
                target: !!$checkbox.value,
            });
            this.exec(action);
        });
    }

    onUpdate() {
        const $checkbox = this.refs.checkbox as HTMLInputElement;
        // @ts-ignore UICheckbox 类型没有暴露出来
        $checkbox.value = this.details.value;
    }
}
declarePin(BooleanPin);
