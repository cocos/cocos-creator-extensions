import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import TranslateData from '../../../src/lib/core/entity/translate/TranslateData';
import TranslateItem from '../../../src/lib/core/entity/translate/TranslateItem';
import { container } from 'tsyringe';
import UUIDService from '../../../src/lib/core/service/util/UUIDService';
import TranslateItemType from '../../../src/lib/core/entity/translate/TranslateItemType';
import { readFile, readFileSync, readJSONSync, writeFileSync } from 'fs-extra';
import ICSVTranslateItem from '../../../src/lib/core/entity/csv/ICSVTranslateItem';
import { join } from 'path';
import { PluralRules } from '../../../src/lib/core/type/type';

describe('Translate File for CSV', () => {
    const uuidService = container.resolve(UUIDService);
    const filePath = '/Users/bppleman/Desktop/temp/csv.csv';
    const pluralRules = readJSONSync(join(__dirname, '..', '..', '..', 'static', 'plural-rules', 'plural-rules.json')) as PluralRules;

    test('export', () => {
        const source = new TranslateData('zh-Hans-CN');
        for (let i = 0; i < 5; ++i) {
            const item = new TranslateItem(
                uuidService.v4(),
                uuidService.v4(),
                TranslateItemType.Text,
            );
            if (Math.random() < 0.5) {
                item.addVariant(new TranslateItem(
                    `${item.key}_other`,
                    uuidService.v4(),
                    item.type,
                    true,
                ));
            }
            source.items.set(item.key, item);
        }
        const target = new TranslateData('en-US');

        const csvTranslateItems: ICSVTranslateItem[] = [];
        for (const [key, sourceItem] of source.items.entries()) {
            const targetItem = target.items.get(key);
            csvTranslateItems.push({
                key: key,
                sourceValue: sourceItem.value,
                targetValue: targetItem?.value ?? '',
            });
            if (sourceItem.variants.length > 0 || (targetItem?.variants.length ?? 0) > 0) {
                const plurals = pluralRules[(new Intl.Locale(target.locale)).language!];
                for (const [i, plural] of plurals.entries()) {
                    const variant = targetItem?.variants?.find(it => it.key.includes(plural));
                    csvTranslateItems.push({
                        key: variant?.key ?? `${key}_${plural}`,
                        sourceValue: '',
                        targetValue: variant?.value ?? '',
                    });
                }
            }
        }

        const content = stringify(csvTranslateItems, {
            header: true,
            columns: ['key', 'sourceValue', 'targetValue'],
        });
        writeFileSync(filePath, content, 'utf-8');
    });

    test('import', () => {
        const content = readFileSync(filePath);
        const items = parse(content) as ICSVTranslateItem[];
        items.forEach(item => {
            console.log(item);
        });
    });
});
