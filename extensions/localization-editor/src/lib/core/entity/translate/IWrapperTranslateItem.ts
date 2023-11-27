/* eslint-disable semi */
import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import ITranslateItem from './ITranslateItem';
import IWrapperAssociation from './IWrapperAssociation';

export default interface IWrapperTranslateItem extends ITranslateItem{
    locale?: string,
    displayName?: string,
    assetInfo?: AssetInfo | null,
    associations: IWrapperAssociation[],
}
