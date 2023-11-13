'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';

type Texture2DDetail = {
    value: {
        uuid: string
    };
};

class TexturePinAction extends PinAction<{
    source: Texture2DDetail['value'],
    target: Texture2DDetail['value'],
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
class Texture2DPin extends Pin<Texture2DDetail> {
    static type = 'texture2D';

    color = '#9691b2';
    line = 'normal';
    details = {
        value: {
            uuid: '',
        },
    };

    style = `
        .image-preview {
            width: 100%;
            height: 100px;
            background-color: black;
        }
    `;

    contentSlot = /*html*/`<ui-asset style="flex: 1;" ref="texture2D" droppable="cc.Texture2D"></ui-asset>`;
    childrenSlot = [
        `
<ui-section ref="section" class="config">
    <ui-image class="image-preview" ref="imagePreview"></ui-image>
</ui-section>
`,
    ];

    onInit() {
        const $texture2D = this.refs.texture2D as HTMLInputElement;
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

    changeImagePreview(uuid: string) {
        const $imagePreview = this.refs.imagePreview;
        // @ts-ignore
        $imagePreview.value = uuid;
        if (uuid) {
            this.refs.section.style.display = '';
            this.refs.section.setAttribute('expand', '');
        } else {
            this.refs.section.style.display = 'none';
        }
    }

    onUpdate() {
        const $texture2D = this.refs.texture2D as HTMLInputElement;
        $texture2D.value = this.details.value.uuid;

        this.changeImagePreview(this.details.value.uuid);
    }
}
declarePin(Texture2DPin);
