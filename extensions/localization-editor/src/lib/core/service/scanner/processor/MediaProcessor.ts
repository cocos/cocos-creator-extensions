import { autoInjectable } from 'tsyringe';
import IProcessor from './IProcessor';
import TranslateItem from '../../../entity/translate/TranslateItem';
import { AssetInfo } from '@editor/library-type/packages/asset-db/@types/public';
import TranslateItemType from '../../../entity/translate/TranslateItemType';
import { TranslateItemArray, TranslateItemValue } from '../../../type/type';
import Association from '../../../entity/translate/Association';

@autoInjectable()
export default class MediaProcessor implements IProcessor {
    started = true;

    process(assetInfo: AssetInfo, translateItemValueMap: Map<TranslateItemValue, TranslateItem>): Promise<TranslateItemArray> {
        const translateItem = new TranslateItem(assetInfo.uuid, assetInfo.uuid, TranslateItemType.Media);
        translateItem.associations.push(Association.create({ reference: assetInfo.uuid }));
        return Promise.resolve([translateItem]);
    }

    cancel(): void {
        this.started = false;
    }
}
