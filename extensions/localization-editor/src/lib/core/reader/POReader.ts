import Reader from './Reader';
import { PluralRules, TranslateFileType } from '../type/type';
import TranslateData from '../entity/translate/TranslateData';
import { readFile } from 'fs-extra';
import { GetTextTranslation, po } from 'gettext-parser';
import TranslateItem from '../entity/translate/TranslateItem';
import { inject, singleton } from 'tsyringe';
import TranslateItemType from '../entity/translate/TranslateItemType';
import UUIDService from '../service/util/UUIDService';

@singleton()
export default class POReader implements Reader {
    type: TranslateFileType = TranslateFileType.PO;

    constructor(
        @inject('PluralRules')
        public pluralRules: PluralRules,
        public uuidService: UUIDService,
    ) {}

    async read(filePath: string): Promise<TranslateData> {
        const fileBuffer = await readFile(filePath);
        const gettextTranslations = po.parse(fileBuffer, 'utf-8');
        const translations = gettextTranslations.translations[''];
        const translateData = new TranslateData(gettextTranslations.headers['Language']);
        for (const [key, value] of Object.entries(translations)) {
            if (!key) continue;
            const item = this.transform(value, translateData.locale);
            if (item) {
                translateData.items.set(item.key, item);
            }
        }
        return translateData;
    }

    transform(translation: GetTextTranslation, locale: Intl.BCP47LanguageTag): TranslateItem | undefined {
        const item = new TranslateItem(
            translation.comments.reference ?? this.uuidService.v4(),
            '',
            TranslateItemType.External,
        );
        if (translation.msgid_plural) {
            item.value = translation.msgid_plural;
            const plurals = this.pluralRules[(new Intl.Locale(locale)).language!] ?? ['other'];
            for (const [i, plural] of plurals.entries()) {
                const variant = new TranslateItem(
                    `${item.key}_${plural}`,
                    translation.msgstr[i],
                    item.type,
                    true,
                );
                item.addVariant(variant);
            }
        } else {
            item.value = translation.msgstr[0];
        }
        if (item.value) {
            return item;
        } else {
            return undefined;
        }
    }
}
