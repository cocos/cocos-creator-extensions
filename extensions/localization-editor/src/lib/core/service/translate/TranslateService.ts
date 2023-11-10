/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { autoInjectable, container, injectAllWithTransform } from 'tsyringe';
import ProjectConfigService from '../persistent/ProjectConfigService';
import { TranslateRepository, TranslateRepositoryTransform } from '../../repository/translate/TranslateRepository';
import YouDaoRepository from '../../repository/translate/YouDaoRepository';
import { CustomError } from '../../error/Errors';
import { MessageCode } from '../../entity/messages/MainMessage';
import TranslateDataSourceService from '../persistent/TranslateDataSourceService';
import { TranslateRequest } from '../../repository/translate/TranslateRequest';
import EditorMessageService from '../EditorMessageService';
import TranslateData from '../../entity/translate/TranslateData';
import TranslateItem from '../../entity/translate/TranslateItem';
import TranslateItemType from '../../entity/translate/TranslateItemType';
import GoogleRepository from '../../repository/translate/GoogleRepository';
import EditorConfigService from '../persistent/EditorConfigService';

container.register('TranslateRepository', { useClass: YouDaoRepository });
container.register('TranslateRepository', { useClass: GoogleRepository });

@autoInjectable()
export default class TranslateService {
    constructor(
        public globalConfigService: ProjectConfigService,
        public translateDataSourceService: TranslateDataSourceService,
        public editorConfigService: EditorConfigService,
        public editorMessageService: EditorMessageService,
        @injectAllWithTransform('TranslateRepository', TranslateRepositoryTransform)
        public translateRepositoryMap: Map<string, TranslateRepository>,
    ) {}

    async translate(from: TranslateData, to: TranslateData): Promise<TranslateItem[]> {
        const providerConfig = this.editorConfigService.getCurrentTranslateProviderConfig();
        if (!providerConfig) {
            throw new CustomError(MessageCode.TRANSLATE_PROVIDER_CONFIG_NOT_FOUND);
        }
        if (!(from.languageConfig)!.providerTag) {
            throw new CustomError(MessageCode.PROVIDER_TAG_NOT_FOUND);
        }
        if (!(to.languageConfig)!.providerTag) {
            throw new CustomError(MessageCode.PROVIDER_TAG_NOT_FOUND);
        }
        const toTranslateItems = this.translateDataSourceService.getShouldTranslateItems(to.locale)
            .filter((item) => item.type !== TranslateItemType.Media);
        return new Promise<TranslateItem[]>((resolve, reject) => {
            let index = 0;
            let begin = 0;
            let end = 0;
            const count = 20;
            const translateResults: TranslateItem[] = [];
            const allRequests: Promise<void>[] = [];
            const timer = setInterval(() => {
                end = (begin + count) > toTranslateItems.length ? toTranslateItems.length : (begin + count);
                const slice = toTranslateItems.slice(begin, end);
                const translateRequest: TranslateRequest = {
                    url: (providerConfig.url)!,
                    query: slice.map((item) => item.value),
                    from: ((from.languageConfig)!.providerTag)!,
                    to: ((to.languageConfig)!.providerTag)!,
                    appKey: providerConfig.appKey,
                    appSecret: providerConfig.appSecret,
                };
                const response = this.request(providerConfig.name, translateRequest);
                allRequests.push(response.then((translateResult) => {
                    for (let i = 0; i < translateResult.length; i++) {
                        const item = to.items.get(slice[i].key) ?? slice[i].clone();
                        item.value = translateResult[i];
                        translateResults.push(item);
                    }
                    this.editorMessageService.translateProgress(index, toTranslateItems.length / count, (to.languageConfig)!.bcp47Tag);
                    return Promise.resolve();
                }).catch((reason) => {
                    reject(reason);
                    clearInterval(timer);
                }));
                begin = end;
                index += 1;
                if (begin >= toTranslateItems.length) {
                    Promise.all(allRequests).then(() => {
                        resolve(translateResults);
                    });
                    clearInterval(timer);
                }
            }, 1000 / (providerConfig.qps)!);
        });
    }

    async request(name: string, request: TranslateRequest): Promise<string[]> {
        if (request.query.length === 0) return [];
        const response = await this.translateRepositoryMap.get(name)!
            .translate(request);
        return response.translation;
    }
}
