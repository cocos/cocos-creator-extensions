import { singleton } from 'tsyringe';
import type { ResourceBundle, ResourceData, ResourceItem } from '../../../../../@types/runtime/l10n';
import ITranslateData from '../../entity/translate/ITranslateData';
import ITranslateItem from '../../entity/translate/ITranslateItem';
import TranslateData from '../../entity/translate/TranslateData';
import TranslateItemType from '../../entity/translate/TranslateItemType';
import EditorMessageService from '../EditorMessageService';
import { ALLOW_NAMESPACE, ASSET_NAMESPACE, DEFAULT_NAMESPACE, MainName } from '../util/global';
import TranslateDataSourceService from './TranslateDataSourceService';

@singleton()
export default class CompileService {
    constructor(
        public translateDataSourceService: TranslateDataSourceService,
        public editorMessageService: EditorMessageService,
    ) { }

    async addSubAssetUUIDToResourceItem(resourceItem: ResourceItem, item: ITranslateItem) {
        const info = await this.editorMessageService.queryAssetInfo(item.key);
        if (info) {
            for (const key in info.subAssets) {
                const subAssetInfoUUID = info.subAssets[key];
                const replacedUUID = subAssetInfoUUID.uuid.replace(item.key, item.value);
                if (await this.editorMessageService.queryAssetInfo(replacedUUID)) {
                    resourceItem[subAssetInfoUUID.uuid] = replacedUUID;
                }
                else {
                    console.warn(`[${MainName}]: UUID mapping from "${subAssetInfoUUID}" to "${replacedUUID}" fails because asset with UUID "${replacedUUID}" does not exist`);
                }
            }
        }
    }
    async translateDataToResourceData(translateData: ITranslateData): Promise<ResourceData> {
        const resourceData: ResourceData = {};
        ALLOW_NAMESPACE.forEach(ns => resourceData[ns] = {});
        for (const [key, item] of translateData.items.entries()) {
            if (item.type === TranslateItemType.Media) {
                if (item.value !== item.key) {
                    resourceData[ASSET_NAMESPACE][item.key] = item.value;
                    await this.addSubAssetUUIDToResourceItem(resourceData[ASSET_NAMESPACE], item);
                }
            } else {
                resourceData[DEFAULT_NAMESPACE][item.key] = item.value;
                for (const v of item._variants) {
                    resourceData[DEFAULT_NAMESPACE][v.key] = v.value;
                }
            }
        }
        return resourceData;
    }
    async compile(locales: Intl.BCP47LanguageTag[]): Promise<ResourceBundle> {
        let translateDataArray!: TranslateData[];
        if (locales.length > 0) {
            translateDataArray = locales.map((it) => this.translateDataSourceService.getClonedTranslateData(it)!);
        } else {
            translateDataArray = this.translateDataSourceService.getClonedAllTranslateData().filter(data => data.locale !== TranslateData.INDEX_LOCALE);
        }

        const resourceBundle: ResourceBundle = {};

        for (let index = 0; index < translateDataArray.length; index++) {
            const translateData = translateDataArray[index];
            const resourcesData = await this.translateDataToResourceData(translateData);
            resourceBundle[translateData.locale] = resourcesData;
        }
        return resourceBundle;
    }
}
