import { autoInjectable } from 'tsyringe';
import IProcessor from './IProcessor';
import TranslateItem from '../../../entity/translate/TranslateItem';
import Association from '../../../entity/translate/Association';
import { AssetInfo } from '@editor/library-type/packages/asset-db/@types/public';
import TranslateItemType from '../../../entity/translate/TranslateItemType';
import { TranslateItemArray, TranslateItemKey, TranslateItemValue } from '../../../type/type';

@autoInjectable()
export default class ScriptProcessor implements IProcessor {
    private static CalleeName = 'l10n.t';

    started = true;

    async process(assetInfo: AssetInfo, translateItemValueMap: Map<TranslateItemValue, TranslateItem>): Promise<TranslateItemArray> {
        const { GettextExtractor, JsExtractors } = await import('gettext-extractor');
        const extractor = new GettextExtractor();
        extractor
            .createJsParser([
                JsExtractors.callExpression(ScriptProcessor.CalleeName, {
                    arguments: {
                        text: 0,
                        context: 1,
                    },
                }),
            ])
            .parseFile(assetInfo.file);
        const keyMap: Map<TranslateItemKey, TranslateItem> = new Map<TranslateItemKey, TranslateItem>();
        for (const message of extractor.getMessages()) {
            if (!message.text) continue;
            const item = new TranslateItem(message.text, '', TranslateItemType.Script);
            item.associations.push(Association.create({ reference: assetInfo.uuid }));
            keyMap.set(item.key, item);
        }
        return Promise.resolve(Array.from(keyMap.values()));
    }

    cancel(): void {
        this.started = false;
    }
}
