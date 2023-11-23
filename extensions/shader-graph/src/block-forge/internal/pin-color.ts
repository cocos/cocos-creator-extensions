'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

type ColorDetail = {
    value: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
};

class ColorPinAction extends PinAction<{
    source: ColorDetail['value'],
    target: ColorDetail['value'],
}> {

    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        const $pin = params.forge.getPinElement(this.detail.blockName, 'input', this.detail.index);
        if ($pin) {
            // @ts-ignore
            const pin = $pin.__pin as ColorPin;
            pin.details.value = this.detail.target;
            pin.onUpdate();
        }
    }

    revertAction() {
        return new ColorPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Float
 * 浮点类型的引脚
 */
class ColorPin extends Pin<ColorDetail> {
    static type = 'color';

    color = '#8471cf';
    line = 'normal';
    details = {
        value: {
            x: 0, y: 0, z: 0, w: 1,
        },
    };

    contentSlot = /*html*/`<ui-color ref="color"></ui-color>`;
    childrenSlot = [];

    onInit() {
        const $color = this.refs.color as HTMLInputElement;
        $color.addEventListener('confirm', () => {
            const x = parseFloat($color.value[0]) / 255;
            const y = parseFloat($color.value[1]) / 255;
            const z = parseFloat($color.value[2]) / 255;
            const w = parseFloat($color.value[3]) / 255;
            if (!this.details) {
                this.details = {
                    value: { x, y, z, w },
                };
            }
            
            const action = new ColorPinAction(this, {
                source: this.details.value,
                target: { x, y, z, w },
            });
            this.exec(action);
        });
    }

    onUpdate() {
        const $color = this.refs.color as HTMLInputElement;
        const color = this.details.value;
        $color.value = JSON.stringify([color.x * 255, color.y * 255, color.z * 255, color.w * 255]);
    }
}
declarePin(ColorPin);
