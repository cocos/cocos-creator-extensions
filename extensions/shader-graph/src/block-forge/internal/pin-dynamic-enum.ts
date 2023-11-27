'use strict';

import type { HTMLGraphForgeElement } from '../forge';
import { Pin, declarePin, PinAction } from '../pin';
import { getDynamicEnumByType, addEnumObserver, EnumType, removeEnumObserver } from '../enum';
import { IPinDescription, PinData } from '../interface';

type DynamicEnumPinDetail = {
    value: any;
    type: string;
}

class DynamicEnumPinAction extends PinAction<{
    source: string,
    target: string,
}> {

    exec(params: {
        forge: HTMLGraphForgeElement
    }) {
        const $pin = params.forge.getPinElement(this.detail.blockName, 'input', this.detail.index);
        if ($pin) {
            // @ts-ignore
            const pin = $pin.__pin as DynamicEnumPin;
            pin.details.value = this.detail.target;
            pin.onUpdate();
        }
    }

    revertAction() {
        return new DynamicEnumPinAction(this.pin, {
            source: this.detail.target,
            target: this.detail.source,
        });
    }
}

/**
 * Enum
 * 枚举类型的引脚
 */
class DynamicEnumPin extends Pin<DynamicEnumPinDetail> {
    static type = 'dynamicEnum';

    color = '#451359';
    line = 'normal';
    details: DynamicEnumPinDetail = {
        type: '',
        value: undefined,
    };

    style = `
        .pin-dynamic-enum {
            flex: 1;
        }
        .jump {
            margin-left: 2px;
        }
        .jump:hover {
            color: white;
        }
    `;

    contentSlot = /*html*/`<ui-select class="pin-dynamic-enum" ref="enum"></ui-select>`;
    // contentSlot = /*html*/`<ui-select class="pin-dynamic-enum" ref="enum"></ui-select><ui-icon class="jump" ref="jump" value="link"></ui-icon>`;
    childrenSlot = [];

    private index = -1;
    private enumList: EnumType[] = [];
    private optionList: HTMLElement[] = [];

    onInit() {
        if (this.desc.details?.type) {
            removeEnumObserver(this.desc.details?.type);
            addEnumObserver(this.desc.details?.type, () => {
                this.sync();
            });
        }
        const $enum = this.refs.enum as HTMLInputElement;
        $enum.addEventListener('confirm', () => {
            this.index = parseInt($enum.value);
            const item = this.enumList[this.index];

            const action = new DynamicEnumPinAction(this, {
                source: this.details.value,
                target: item.name,
            });
            this.exec(action);
        });
    }

    private sync() {
        this.enumList = getDynamicEnumByType(this.details.type);
        const $enum = this.refs.enum as HTMLInputElement;
        this.optionList.forEach(option => $enum.removeChild(option));
        this.optionList.length = 0;

        for (let i = 0; i < this.enumList.length; i++) {
            const item = this.enumList[i];
            const option = document.createElement('option');
            option.innerText = item.name;
            option.setAttribute('value', item.value + '');
            $enum.appendChild(option);
            this.optionList.push(option);

            if (this.details.value && item.name === this.details.value) {
                this.index = i;
                $enum.value = this.index + '';
            }

            if (this.index === i && this.details.value !== item.value) {
                this.details.value = item.name;
            }
        }
        if (this.index === -1 && !this.details.value && this.desc) {
            for (let i = 0; i < this.enumList.length; i++) {
                const item: EnumType = this.enumList[i];
                if (item.name === this.desc.details?.defaultValue) {
                    this.index = i;
                    this.details.value = item.name;
                    break;
                }
            }
            const $enum = this.refs.enum as HTMLInputElement;
            $enum.value = this.index + '';
        }
    }

    onUpdate() {
        const $enum = this.refs.enum as HTMLInputElement;
        this.details.type = this.desc.details?.type;

        this.sync();
    }
}
declarePin(DynamicEnumPin);
