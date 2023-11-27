import Association from './Association';
import TranslateItemType from './TranslateItemType';
import { MergeTranslateItemOption } from '../../type/type';
import ITranslateItem from './ITranslateItem';
import CryptoJS from 'crypto-js';

export default class TranslateItem implements ITranslateItem {
    constructor(
        public key: string,
        public value: string,
        public type: TranslateItemType,
        public isVariant: boolean = false,
        public associations: Association[] = [],
        public _variants: TranslateItem[] = [],
    ) {
        // 检查是否为字符串类型，如果不是则转换为字符串
        if (typeof key !== 'string') {
            this.key = key + '';
        }
        if (typeof value !== 'string') {
            this.value = value + '';
        }
    }

    get variants(): readonly TranslateItem[] {
        return this._variants;
    }

    addVariant(variant: TranslateItem): TranslateItem {
        variant.isVariant = true;
        this._variants.push(variant);
        return this;
    }

    clone(): TranslateItem {
        const newItem = new TranslateItem(this.key, this.value, this.type);
        newItem.isVariant = this.isVariant;
        newItem._variants = this._variants.map((variant) => variant.clone());
        newItem.associations = this.associations.map((association) => association.clone());
        return newItem;
    }

    clearValue(): TranslateItem {
        this.value = '';
        return this;
    }

    clearAssociation(): TranslateItem {
        this.associations.length = 0;
        return this;
    }

    clearVariant(): TranslateItem {
        this._variants.length = 0;
        return this;
    }

    removeAssociation(index: number | Association): Association {
        let associationIndex: number;
        if (typeof index === 'number') {
            associationIndex = index;
        } else {
            associationIndex = this.associations.findIndex((it) => it.equals(index))!;
        }
        const result = this.associations[associationIndex];
        for (let i = associationIndex + 1; i < this.associations.length; i++) {
            this.associations[i - 1] = this.associations[i];
        }
        if (this.associations.length > 0) {
            this.associations.length -= 1;
        }
        return result;
    }

    static parse(value: ITranslateItem): TranslateItem {
        return new TranslateItem(
            value.key,
            value.value,
            value.type,
            value.isVariant,
            value.associations.map((association) => Association.parse(association)),
            value._variants.map((variant) => TranslateItem.parse(variant)),
        );
    }

    equals(value: TranslateItem): boolean {
        return this.key === value.key && this.value === value.value && this.type === value.type && this.isVariant === value.isVariant && this.associations.length === value.associations.length && this._variants.length === value._variants.length;
    }

    merge(value: TranslateItem, {
        replaceVariant = false,
        replaceValue = true,
        replaceKey = false,
        replaceAssociation = false,
    }: MergeTranslateItemOption = {}): TranslateItem {
        if (replaceKey) {
            this.key = value.key;
        }

        if (replaceValue) {
            this.value = value.value;
        }

        if (this.type === TranslateItemType.Media) {
            // clear associations
            this.associations.length = 0;
        }

        if (replaceAssociation) {
            this.associations = value.associations;
        } else {
            const associationKeys = new Set(this.associations.map((association) => JSON.stringify(association)));
            for (const association of value.associations) {
                if (associationKeys.has(JSON.stringify(association))) {
                    continue;
                }
                this.associations.push(association);
            }
        }

        if (replaceVariant) {
            this._variants = value._variants;
        } else {
            const variantKeys = new Set(this._variants.map((variant) => JSON.stringify(variant)));
            for (const variant of value._variants) {
                if (variantKeys.has(JSON.stringify(variant))) {
                    continue;
                }
                this._variants.push(variant);
            }
        }
        return this;
    }

    get length(): number {
        switch (this.type) {
            case TranslateItemType.Text:
            case TranslateItemType.Script:
                return this.value.length;
            case TranslateItemType.Media:
                return 1;
            default:
                return 0;
        }
    }

    static base64Decode(encoded: string): TranslateItem | undefined {
        const decodedWord = CryptoJS.enc.Base64.parse(encoded);
        const decoded = CryptoJS.enc.Utf8.stringify(decodedWord);
        try {
            return TranslateItem.parse(JSON.parse(decoded));
        } catch (e) {
            return undefined;
        }
    }

    base64Encode(): string {
        const str = JSON.stringify(this);
        const encodedWord = CryptoJS.enc.Utf8.parse(str);
        return CryptoJS.enc.Base64.stringify(encodedWord);
    }
}
