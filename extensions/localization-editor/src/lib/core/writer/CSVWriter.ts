import Writer from './Writer';
import { PluralRules, TranslateFileType } from '../type/type';
import TranslateData from '../entity/translate/TranslateData';
import { inject, singleton } from 'tsyringe';
import { stringify } from 'csv-stringify/sync';
import { writeFile } from 'fs-extra';
import ICSVTranslateItem from '../entity/csv/ICSVTranslateItem';
import TranslateItemType from '../entity/translate/TranslateItemType';

@singleton()
export default class CSVWriter implements Writer {
    static LocaleKey = 'LanguageTag';

    type: TranslateFileType = TranslateFileType.CSV;

    constructor(
        @inject('PluralRules')
        public pluralRules: PluralRules,
    ) {}

    async write(filePath: string, data: TranslateData, local: TranslateData): Promise<void> {
        const csvTranslateItems = this.generateCsvTranslateItems(local, data);
        const content = stringify(csvTranslateItems, {
            header: true,
            columns: ['key', 'sourceValue', 'targetValue'],
        });
        await writeFile(filePath, content, 'utf-8');
    }

    generateCsvTranslateItems(source: TranslateData, target: TranslateData): ICSVTranslateItem[] {
        const csvTranslateItems: ICSVTranslateItem[] = [
            {
                key: CSVWriter.LocaleKey,
                sourceValue: source.locale,
                targetValue: target.locale,
            },
        ];
        for (const [key, sourceItem] of source.items.entries()) {
            const targetItem = target.items.get(key);
            if (sourceItem.type === TranslateItemType.Media) {
                continue;
            }
            csvTranslateItems.push({
                key: key,
                sourceValue: sourceItem.value,
                targetValue: targetItem?.value ?? '',
            });
            if (sourceItem.variants.length > 0 || (targetItem?.variants.length ?? 0) > 0) {
                const plurals = this.pluralRules[(new Intl.Locale(target.locale)).language!] ?? ['other'];
                for (const plural of plurals) {
                    const variant = targetItem?.variants?.find(it => it.key.endsWith(plural));
                    csvTranslateItems.push({
                        key: variant?.key ?? `${key}_${plural}`,
                        sourceValue: '',
                        targetValue: variant?.value ?? '',
                    });
                }
            }
        }
        return csvTranslateItems;
    }
}
