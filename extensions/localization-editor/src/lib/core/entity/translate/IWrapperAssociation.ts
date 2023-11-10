/* eslint-disable semi */

import { AssetInfo } from '@editor/library-type/packages/asset-db/@types/public';
import IAssociation from './IAssociation';
import Association from './Association'

export default interface IWrapperAssociation extends IAssociation {
    assetInfo?: AssetInfo;
}
