/* eslint-disable semi */
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import { TranslateItemArray, TranslateItemValue } from '../../../type/type';
import TranslateItem from '../../../entity/translate/TranslateItem';

export default interface IProcessor {
    started: boolean;
    process(assetInfo: AssetInfo, translateItemValueMap: Map<TranslateItemValue, TranslateItem>): Promise<TranslateItemArray>;
    cancel(): void;
}
