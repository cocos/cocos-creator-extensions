'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';
import { changeDynamicEnumValue } from '../enum';

type StringPintDetail = {
    value: string;
    details?: {
        registerEnumType: string;
    }
}

class StringPinAction extends PinAction<{
    source: string,
    target: string,
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
        return new StringPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * String
 * 字符串类型的引脚
 */
class StringPin extends Pin<StringPintDetail> {
    static type = 'string';

    color = '#aec537';
    line = 'normal';
    details: StringPintDetail = {
        value: '',
    };

    contentSlot = /*html*/`<ui-input ref="input"></ui-input>`;
    childrenSlot = [];

    style = `
.string .slot-content ui-input { color: white; }
    `;

    onInit() {
        const $input = this.refs.input as HTMLInputElement;
        $input.addEventListener('confirm', () => {
            if (this.details.details?.registerEnumType) {
                changeDynamicEnumValue(this.details.details.registerEnumType, $input.value, this.details.value);
            }

            const action = new StringPinAction(this, {
                source: this.details.value,
                target: $input.value,
            });
            this.exec(action);
        });
    }

    onUpdate() {
        const $input = this.refs.input as HTMLInputElement;
        $input.value = this.details.value;
    }
}
declarePin(StringPin);
