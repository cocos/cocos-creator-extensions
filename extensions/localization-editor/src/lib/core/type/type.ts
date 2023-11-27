import TranslateData from '../entity/translate/TranslateData';
import TranslateItem from '../entity/translate/TranslateItem';

export type PromiseLikeOrOriginal<T> = Promise<T> | T;

export type ScanProgressFunction = ((finished: number, total: number) => void);

export type TranslateDataMap = Map<Intl.BCP47LanguageTag, TranslateData>;

export type TranslateItemKey = string;

export type TranslateItemValue = string;

export type TranslateItemArray = Array<TranslateItem>;

export interface MergeTranslateItemOption {
    /**
     * @default false
     */
    replaceVariant?: boolean;
    /**
     * @default true
     */
    replaceValue?: boolean;
    /**
     * @default false
     */
    replaceKey?: boolean;
    /**
     * @default false
     */
    replaceAssociation?: boolean;
}

export enum TranslateFileType {
    PO,
    CSV,
    XLSX,
}

export type PluralRules = {
    [language: Intl.BCP47LanguageTag]: Intl.LDMLPluralRule[]
}
