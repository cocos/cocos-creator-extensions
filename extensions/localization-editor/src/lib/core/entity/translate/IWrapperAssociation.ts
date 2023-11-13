/* eslint-disable semi */

import { AssetInfo } from '@cocos/creator-types/editor/packages/asset-db/@types/public';
import IAssociation from './IAssociation';
import Association from './Association'

export default interface IWrapperAssociation extends IAssociation {
    assetInfo?: AssetInfo;
}
