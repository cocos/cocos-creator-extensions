import { inject, singleton } from 'tsyringe';
import Writer from './Writer';
import TranslateData from '../entity/translate/TranslateData';
import PoHeader from '../entity/gettext/PoHeader';
import { GetTextComment, GetTextTranslation, GetTextTranslations, po } from 'gettext-parser';
import TranslateItem from '../entity/translate/TranslateItem';
import { writeFile } from 'fs-extra';
import TranslateItemType from '../entity/translate/TranslateItemType';
import { PluralRules, TranslateFileType } from '../type/type';

@singleton()
export default class POWriter implements Writer {
    type = TranslateFileType.PO;

    constructor(
        @inject('PluralRules')
        public pluralRules: PluralRules,
    ) {}

    async write(filePath: string, data: TranslateData, local: TranslateData): Promise<void> {
        const header = new PoHeader(
            data.locale,
            'CocosCreator',
            'cocosCreator',
            (new Date()).toUTCString(),
            (new Date()).toUTCString(),
            '',
            '',
        );
        const translations: { [msgId: string]: GetTextTranslation } = {};
        for (const [key, item] of local.items.entries()) {
            if (item.type === TranslateItemType.Media) {
                continue;
            }
            translations[key] = this.transform(item, data.locale, data.items.get(key));
        }

        const gettextTranslations: GetTextTranslations = {
            charset: 'utf-8',
            headers: header,
            translations: {
                '': translations,
            },
        };
        const poContentBuffer = po.compile(gettextTranslations, { escapeCharacters: true });
        await writeFile(filePath, poContentBuffer, 'utf-8');
    }

    transform(localItem: TranslateItem, locale: Intl.BCP47LanguageTag, item?: TranslateItem): GetTextTranslation {
        const comment: GetTextComment = {
            extracted: '',
            flag: '',
            previous: '',
            reference: localItem.key,
            translator: '',
        };
        return {
            comments: comment,
            msgid: localItem.value,
            msgid_plural: (() => {
                if (item && item.variants.length > 0) {
                    return item.value;
                }
                if (localItem.variants.length > 0) {
                    return localItem.value;
                }
                return undefined;
            })(),
            msgstr: (() => {
                if (localItem.variants.length > 0) {
                    const plurals = this.pluralRules[(new Intl.Locale(locale)).language!] ?? ['other'];
                    return plurals.map(plural => {
                        const variant: TranslateItem | undefined = item?.variants.find(it => it.key.endsWith(plural));
                        return variant?.value ?? '';
                    });
                } else {
                    return [item?.value ?? ''];
                }
            })(),
        };
    }
}
