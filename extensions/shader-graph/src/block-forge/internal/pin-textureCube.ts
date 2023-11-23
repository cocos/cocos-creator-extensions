'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

type TextureCubeDetail = {
    value: {
        uuid: string
    };
};

class TexturePinAction extends PinAction<{
    source: TextureCubeDetail['value'],
    target: TextureCubeDetail['value'],
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
        return new TexturePinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Float
 * 浮点类型的引脚
 */
class TextureCubePin extends Pin<TextureCubeDetail> {
    static type = 'textureCube';

    color = '#9691b2';
    line = 'normal';
    details = {
        value: {
            uuid: '',
        },
    };

    contentSlot = /*html*/`<ui-asset ref="textureCube" droppable="cc.TextureCube"></ui-asset>`;
    childrenSlot = [];

    onInit() {
        const $texture2D = this.refs.textureCube as HTMLInputElement;
        $texture2D.addEventListener('confirm', () => {
            if (!this.details) {
                this.details = {
                    value: {
                        uuid: $texture2D.value,
                    },
                };
            }

            const action = new TexturePinAction(this, {
                source: this.details.value,
                target: { uuid: $texture2D.value },
            });
            this.exec(action);
        });
    }

    onUpdate() {
        const $texture2D = this.refs.textureCube as HTMLInputElement;
        $texture2D.value = this.details.value.uuid;
    }
}
declarePin(TextureCubePin);
