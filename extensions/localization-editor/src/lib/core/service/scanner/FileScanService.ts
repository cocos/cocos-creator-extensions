import { singleton } from 'tsyringe';
import TranslateData from '../../entity/translate/TranslateData';
import TranslateItemType from '../../entity/translate/TranslateItemType';
import EditorMessageService from '../EditorMessageService';
import TranslateItem from '../../entity/translate/TranslateItem';
import TranslateDataSourceService from '../persistent/TranslateDataSourceService';
import { ScanProgressFunction } from '../../type/type';

@singleton()
export default class FileScanService {
    constructor(
        public editorMessageService: EditorMessageService,
        public translateDataSourceService: TranslateDataSourceService,
    ) {

    }
    async scan(
        from: TranslateData,
        to: TranslateData,
        { fromPattern, toPattern, progress }: {fromPattern?: string, toPattern?: string, progress?: ScanProgressFunction} = {},
    ): Promise<TranslateItem[]> {
        const dbURL: 'db://assets/' = 'db://assets/';

        const shouldTranslateItems = this.translateDataSourceService
            .getShouldTranslateItems(to.locale)
            .filter((item) => item.type === TranslateItemType.Media);
        console.debug('FileScanService.scan shouldTranslateItems', shouldTranslateItems);
        const result: TranslateItem[] = [];
        for (const [i, item] of shouldTranslateItems.entries()) {
            progress?.(i + 1, shouldTranslateItems.length);
            const assetInfo = await this.editorMessageService.queryAssetInfo(item.value);
            if (!assetInfo) {
                console.debug(`FileScanService.scan not found: ${item.value} assetInfo`);
                continue;
            }
            
            const targetUrl = dbURL + assetInfo.url.slice(dbURL.length).replaceAll(fromPattern ?? from.locale, toPattern ?? to.locale);
            if (!targetUrl.startsWith(dbURL)) {
                console.warn(`FileScanService.scan the resources: ${targetUrl} not into ${dbURL}`);
                continue;
            }
            if (targetUrl === assetInfo.url) {
                continue;
            }
            const targetAssetInfo = await this.editorMessageService.queryAssetInfo(targetUrl);
            if (!targetAssetInfo) {
                console.warn(`FileScanService.scan not found: ${targetUrl} assetInfo`);
                continue;
            }
            const targetItem = item.clone();
            targetItem.value = targetAssetInfo.uuid;
            result.push(targetItem);
        }
        return result;
    }
}
