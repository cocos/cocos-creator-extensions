/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Reader from './Reader';
import { inject, singleton } from 'tsyringe';
import { PluralRules, TranslateFileType } from '../type/type';
import TranslateData from '../entity/translate/TranslateData';
import { readFile } from 'fs-extra';
import { parse } from 'csv-parse/sync';
import ICSVTranslateItem from '../entity/csv/ICSVTranslateItem';
import CSVWriter from '../writer/CSVWriter';
import { CustomError } from '../error/Errors';
import { MessageCode } from '../entity/messages/MainMessage';
import TranslateItem from '../entity/translate/TranslateItem';
import TranslateItemType from '../entity/translate/TranslateItemType';
import UUIDService from '../service/util/UUIDService';

@singleton()
export default class CSVReader implements Reader {
    type: TranslateFileType = TranslateFileType.CSV;

    constructor(
        @inject('PluralRules')
        public pluralRules: PluralRules,
        public uuidService: UUIDService,
    ) {}

    async read(filePath: string): Promise<TranslateData> {
        const csvFileBuffer = await readFile(filePath);
        const csvTranslateItems: ICSVTranslateItem[] = parse(csvFileBuffer).map((it: string[]): ICSVTranslateItem => {
            return {
                key: it[0],
                sourceValue: it[1],
                targetValue: it[2],
            };
        });
        csvTranslateItems.shift();
        return this.generateTranslateData(csvTranslateItems);
    }

    protected generateTranslateData(csvTranslateItems: ICSVTranslateItem[]): TranslateData {
        if (csvTranslateItems.length < 1 || csvTranslateItems[0].key !== CSVWriter.LocaleKey) {
            throw new CustomError(MessageCode.UNAVAILABLE_CSV_FILE, `file not found ${CSVWriter.LocaleKey}`);
        }
        const translateData = new TranslateData(csvTranslateItems[0].targetValue);
        const plurals: Intl.LDMLPluralRule[] = this.pluralRules[(new Intl.Locale(translateData.locale)).language!] ?? ['other'];
        csvTranslateItems.shift();
        for (const csvItem of csvTranslateItems) {
            let originItem!: TranslateItem;
            // 检查是否为字符串类型，如果不是则转换为字符串
            const targetValue = csvItem.targetValue + '';
            if (this.checkVariant(plurals, csvItem)) {
                const originKey = this.trimPluralRule(plurals, csvItem);
                originItem = translateData.items.get(originKey) ?? new TranslateItem(originKey, '', TranslateItemType.External);
                originItem.addVariant(new TranslateItem(csvItem.key, targetValue, TranslateItemType.External));
            } else {
                originItem = translateData.items.get(csvItem.key) ?? new TranslateItem(csvItem.key, targetValue, TranslateItemType.External);
                originItem.value = targetValue;
            }
            translateData.items.set(originItem.key, originItem);
        }
        return translateData;
    }

    protected checkVariant(plurals: Intl.LDMLPluralRule[], csvItem: ICSVTranslateItem): Intl.LDMLPluralRule | undefined {
        return plurals.find(plural => csvItem.key.endsWith(plural));
    }

    protected trimPluralRule(plurals: Intl.LDMLPluralRule[], csvItem: ICSVTranslateItem): string {
        const plural = this.checkVariant(plurals, csvItem);
        let trimKey = csvItem.key.replace(new RegExp(`_${plural}$`), '');
        trimKey = trimKey.length > 0 ? trimKey : this.uuidService.v4();
        return trimKey;
    }
}
