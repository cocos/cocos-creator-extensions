import { singleton } from 'tsyringe';
import { IBuildTaskItemJSON } from '@cocos/creator-types/editor/packages/builder/@types/public';
import { MainName } from '../util/global';
import ILocalizationEditorOptions from '../../../builder/ILocalizationEditorOptions';
import TranslateDataSourceService from '../persistent/TranslateDataSourceService';
import TranslateData from '../../entity/translate/TranslateData';

@singleton()
export default class TrackService {
    constructor(
        public translateDataSourceService: TranslateDataSourceService,
    ) {}

    static EVENT_ID = 'l10n';
    static BUILD_SUCCESS_WITH_L10N = 'A100000';
    static BUILD_SUCCESS_FOR_LANGUAGE(language: Intl.BCP47LanguageTag) {
        return `B100001_${language}`;
    }

    builderTaskSet: Set<string> = new Set<string>();

    async trackBuilder(id: string, info?: IBuildTaskItemJSON) {
        if (!info) return;
        const option: ILocalizationEditorOptions | undefined = info.options.packages?.[MainName];
        if (info.progress !== 1) {
            this.builderTaskSet.add(id);
        } else {
            this.builderTaskSet.delete(id);
            if (info.state === 'success' && option) {
                const value: {[key: string]: number} = {
                };
                value[TrackService.BUILD_SUCCESS_WITH_L10N] = 1;
                // @ts-ignore
                Editor.Metrics.trackEvent({
                    sendToNewCocosAnalyticsOnly: true,
                    category: TrackService.EVENT_ID,
                    value: value,
                });
                let indexData:TranslateData;
                try {
                    indexData = this.translateDataSourceService.getClonedIndexData();
                } catch (error) {
                    // 都加载不到 index-data 了，尝试一次读取配置文件再继续
                    await this.translateDataSourceService.read();
                    indexData = this.translateDataSourceService.getClonedIndexData();
                }
                const languages = this.translateDataSourceService.getAllLanguageTags();

                const allKeys = Array.from(indexData.items.keys());
                if (allKeys.length > 0 && languages.length >= 2) {
                    Object.keys(option.targetLanguageMap!).forEach(language => {
                        const value: {[key: string]: number} = {};
                        value[TrackService.BUILD_SUCCESS_FOR_LANGUAGE(language)] = allKeys.length;
                        // @ts-ignore
                        Editor.Metrics.trackEvent({
                            sendToNewCocosAnalyticsOnly: true,
                            category: TrackService.EVENT_ID,
                            value: value,
                        });
                    });
                }
            }
        }
    }
}
