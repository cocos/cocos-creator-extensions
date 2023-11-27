import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Transform } from 'tsyringe/dist/typings/types';
import { TranslateRequest } from './TranslateRequest';
import { TranslateResponse } from './TranslateResponse';
import { SupportedTranslateProvider } from '../../entity/config/ITranslateProviderConfig';

export abstract class TranslateRepository {
    abstract name: SupportedTranslateProvider;

    abstract transformTranslateRequestConfig (translateRequest: TranslateRequest): AxiosRequestConfig;

    abstract transformTranslateResponse (response?: AxiosResponse): TranslateResponse;

    async translate(translateRequest: TranslateRequest): Promise<TranslateResponse> {
        const request = this.transformTranslateRequestConfig(translateRequest);
        let response: AxiosResponse = <AxiosResponse> {};
        try {
            response = await axios.request(request);
        } catch (e: any) {
            response = (<AxiosError>e).response ?? <AxiosResponse> {
                status: e.status ?? -1,
                statusText: e.code ?? e,
            };
        }
        return this.transformTranslateResponse(response);
    }
}

export class TranslateRepositoryTransform implements
    Transform<
    TranslateRepository[],
    Map<string, TranslateRepository>
    > {
    transform(incoming: TranslateRepository[], args: any): Map<string, TranslateRepository> {
        const map = new Map<string, TranslateRepository>();
        incoming.forEach((item) => {
            map.set(item.name, item);
        });
        return map;
    }
}
