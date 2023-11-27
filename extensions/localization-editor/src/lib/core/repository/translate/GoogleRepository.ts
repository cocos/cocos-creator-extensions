import { TranslateRepository } from './TranslateRepository';
import { GoogleTranslateRequest, TranslateRequest } from './TranslateRequest';
import { GoogleTranslateResponse, TranslateResponse } from './TranslateResponse';
import { SupportedTranslateProvider } from '../../entity/config/ITranslateProviderConfig';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CustomError } from '../../error/Errors';
import { MessageCode } from '../../entity/messages/MainMessage';

export default class GoogleRepository extends TranslateRepository {
    name: SupportedTranslateProvider = 'GOOGLE';

    transformTranslateRequestConfig(translateRequest: TranslateRequest): AxiosRequestConfig {
        const request: GoogleTranslateRequest = {
            q: translateRequest.query.join('|'),
            source: translateRequest.from,
            target: translateRequest.to,
            'X-RapidAPI-Host': translateRequest.appKey ?? '',
            'X-RapidApi-Key': translateRequest.appSecret ?? '',
        };
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('q', request.q);
        urlSearchParams.append('source', request.source);
        urlSearchParams.append('target', request.target);
        const headers: any = {};
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        headers['X-RapidAPI-Host'] = request['X-RapidAPI-Host'];
        headers['X-RapidAPI-Key'] = request['X-RapidApi-Key'];
        headers['Accept-Encoding'] = 'application/gzip';

        return <AxiosRequestConfig> {
            url: translateRequest.url,
            method: 'post',
            data: urlSearchParams,
            headers: headers,
        };
    }

    transformTranslateResponse(response: AxiosResponse): TranslateResponse {
        if (response.status !== 200) {
            throw new CustomError(MessageCode.PROVIDER_INPUT_ERROR, `${response?.status} ${response?.statusText} ${response?.data?.message}`);
        }
        const translateResponse: GoogleTranslateResponse = response.data as GoogleTranslateResponse;
        return {
            translation: translateResponse.data.translations[0].translatedText.split('|'),
            status: 200,
        };
    }

}
