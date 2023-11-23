'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import type { BaseElement } from '@itharbors/ui-core';
import { Pin, declarePin, PinAction } from '../pin';
import { getEnumByType } from '../enum';
import { IPinDescription, PinData } from '../interface';

type EnumPinDetail = {
    value: number;
}

class EnumPinAction extends PinAction<{
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
        return new EnumPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Enum
 * 枚举类型的引脚
 */
class EnumPin extends Pin<EnumPinDetail> {
    static type = 'enum';

    color = '#451359';
    line = 'normal';
    details = {
        value: 0,
    };

    style = `
        .pin-enum {
            flex: 1;
        }
    `;

    contentSlot = /*html*/`<ui-select class="pin-enum" ref="enum"></ui-select>`;
    childrenSlot = [];

    onInit() {
        const $enum = this.refs.enum as HTMLInputElement;
        $enum.addEventListener('confirm', () => {
            if (!this.details) {
                this.details = {
                    value: 0,
                };
            }

            const action = new EnumPinAction(this, {
                source: this.details.value,
                target: parseInt($enum.value),
            });
            this.exec(action);
        });
    }

    onUpdate() {
        const $enum = this.refs.enum as HTMLInputElement;

        $enum.innerHTML = '';
        getEnumByType(this.desc.details?.type).forEach((data: { name: string, value: number }) => {
            const option = document.createElement('option');
            option.innerText = data.name;
            option.setAttribute('value', data.value + '');
            $enum.appendChild(option);
        });
        $enum.value = this.details.value + '';
    }
}
declarePin(EnumPin);
