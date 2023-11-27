import 'reflect-metadata';
import { container } from 'tsyringe';
// import CacheService from '../core/service/util/CacheService';
import { enumMap } from './ICUOptionEnumItem';

type Selector<$> = { $: Record<keyof $, any | null> };

export const template = '<div class="content"></div>';

export const style = '';

export const $ = {
    content: '.content',
};

type PanelThis = Selector<typeof $> & { dump: any };

const createSelectorProp = (labelText: string, selectorClassName: string, selectorDefaultValue?: string, selectorOptions: SelectorOption[] = []): HTMLElement => {
    const selectorProp = document.createElement('ui-prop');
    const label = document.createElement('ui-label');
    label.setAttribute('slot', 'label');
    label.innerText = labelText;
    const selector = createSelector(selectorClassName, selectorDefaultValue, selectorOptions);
    selectorProp.appendChild(label);
    selectorProp.appendChild(selector);
    return selectorProp;
};

const createSelector = (className: string, defaultValue?: string, selectorOptions: SelectorOption[] = []): HTMLElement => {
    const selector = document.createElement('ui-select');
    selector.setAttribute('class', className);
    selector.setAttribute('slot', 'content');
    if (defaultValue) {
        selector.setAttribute('value', defaultValue);
    }
    selectorOptions.forEach((option) => {
        selector.appendChild(createOption(option));
    });
    return selector;
};

interface SelectorOption {
    value: string;
    text: string;
}

const createOption = (selectorOption: SelectorOption): HTMLElement => {
    const option = document.createElement('option');
    option.setAttribute('value', selectorOption.value);
    option.innerText = selectorOption.text;
    return option;
};

function defaultRender(this: PanelThis, dump: any) {
    const $prop = document.createElement('ui-prop');
    $prop.setAttribute('type', 'dump');
    // @ts-ignore
    $prop.render(value);
    this.$.content.appendChild($prop);
}

type UIProp = HTMLElement &{render(dump: any): void};
export function update(this: PanelThis, dump: any) {
    this.dump = dump;
    const content = (this.$.content as HTMLElement);
    for (const key in dump.value) {
        const value = dump.value[key];
        let $prop: UIProp |null = content.querySelector(`ui-prop[key=${key}]`);
        if ($prop) {
            $prop.hidden = !value.visible;
        }
        if (!value.visible) {
            continue;
        }
        if (value.group && value.type === 'Enum' && value.enumList && value.enumList.length === 0) {
            value.enumList = enumMap.get(value.group.name)?.get(key.replace('_', '')) ?? [];
            if (value.enumList.length === 0) {
                console.warn(`${key} has no enumList: ${value.group.name} ${key.replace('_', '')}`);
            }
        }

        if (!$prop) {
            $prop = document.createElement('ui-prop') as UIProp;
            $prop.setAttribute('key', key);
            $prop.setAttribute('type', 'dump');
            content.appendChild($prop);
        }
        $prop.render(value);
    }
}

export function ready(this: PanelThis) {
    // container.resolve(CacheService).clear();
}
