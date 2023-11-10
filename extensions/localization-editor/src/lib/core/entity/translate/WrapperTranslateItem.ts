import { relative } from 'path';
import Association from './Association';
import IAssociation from './IAssociation';
import ITranslateItem from './ITranslateItem';
import IWrapperTranslateItem from './IWrapperTranslateItem';
import TranslateItemType from './TranslateItemType';
import { ProjectAssetPath } from '../../service/util/global';
import { AssetInfo } from '@editor/library-type/packages/asset-db/@types/public';
import IWrapperAssociation from './IWrapperAssociation';

export default class WrapperTranslateItem implements IWrapperTranslateItem {
    constructor(
        public key: string,
        public value: string,
        public type: TranslateItemType,
        public displayName?: string,
        public assetInfo?: AssetInfo | null,
        public associations: IWrapperAssociation[] = [],
        public _variants: WrapperTranslateItem[] = [],
        public isVariant: boolean = false,
        public locale?: string,

    ) { }
    /** 获取一个翻译数据在表格中显示的命称 */
    static getDisplayName(
        info: {
            item?: Readonly<ITranslateItem>;
            assetInfo?: AssetInfo | null;
            value?: string;
        },
    ): string {
        if (info.assetInfo) {
            return relative(ProjectAssetPath, info.assetInfo.file);
        }
        if (info.item) {
            return info.value ?? info.item.value;
        }
        return '';
    }
    static parse(item: WrapperTranslateItem): WrapperTranslateItem {
        return new WrapperTranslateItem(
            item.key,
            item.value,
            item.type,
            item.displayName,
            item.assetInfo,
            item.associations.map((association) => Association.parse(association)),
            item._variants.map((it) => WrapperTranslateItem.parse(it)),
            item.isVariant,
            item.locale,
        );
    }
    /** 将一个 ITranslateItem 构造成 SerializableTranslateItem */
    static async toSerialize(item: ITranslateItem) {
        let assetInfo: AssetInfo | null = null;
        if (item.type === TranslateItemType.Media) {
            assetInfo = await Editor.Message.request('asset-db', 'query-asset-info', item.value || item.key);
        }
        return new WrapperTranslateItem(
            item.key,
            item.value,
            item.type,
            WrapperTranslateItem.getDisplayName({ item, assetInfo }),
            assetInfo,
            item.associations,
            item._variants,
            item.isVariant,
        );
    }
}
