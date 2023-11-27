import { singleton } from 'tsyringe';
import CryptoJS from 'crypto-js';
import FormData from 'form-data';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TranslateRequest, YouDaoTranslateRequest } from './TranslateRequest';
import { TranslateResponse, YouDaoTranslateResponse } from './TranslateResponse';
import UUIDService from '../../service/util/UUIDService';
import { TranslateRepository } from './TranslateRepository';
import { CustomError } from '../../error/Errors';
import { MessageCode } from '../../entity/messages/MainMessage';
import { SupportedTranslateProvider } from '../../entity/config/ITranslateProviderConfig';
import { MainName } from '../../service/util/global';


@singleton()
export default class YouDaoRepository extends TranslateRepository {
    name: SupportedTranslateProvider = 'YOUDAO';

    constructor(
        public uuidService: UUIDService,
    ) {
        super();
    }

    /**
     * @see https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html
     */
    shouldCatchErrorCode: Map<string, string> = new Map<string, string>([
        ['207', Editor.I18n.t(`${MainName}.YOUDAO.207`)],
        ['301', Editor.I18n.t(`${MainName}.YOUDAO.301`)],
        ['302', Editor.I18n.t(`${MainName}.YOUDAO.302`)],
        ['1412', Editor.I18n.t(`${MainName}.YOUDAO.1412`)],
        ['2004', Editor.I18n.t(`${MainName}.YOUDAO.2004`)],
        ['2412', Editor.I18n.t(`${MainName}.YOUDAO.2412`)],
        ['3412', Editor.I18n.t(`${MainName}.YOUDAO.3412`)],
    ]);

    transformTranslateRequestConfig(translateRequest: TranslateRequest): AxiosRequestConfig {
        const salt = this.uuidService.v4();
        const curtime = Math.round(new Date().getTime() / 1000);
        const query = translateRequest.query.filter((it) => it && it.length > 0).join('\n').trim();
        const sign = this.generateSign((translateRequest.appKey)!, (translateRequest.appSecret)!, this.truncate(query), salt, curtime.toString());
        const request = <YouDaoTranslateRequest>{
            q: query,
            from: translateRequest.from,
            to: translateRequest.to,
            appKey: translateRequest.appKey,
            salt,
            sign,
            signType: 'v3',
            curtime,
        };
        const formData = new FormData();
        for (const [key, value] of Object.entries(request)) {
            formData.append(key, value);
        }
        return <AxiosRequestConfig> {
            url: translateRequest.url,
            method: 'post',
            data: formData,
            headers: formData.getHeaders(),
        };
    }

    transformTranslateResponse(response: AxiosResponse): TranslateResponse {
        if (response.status !== 200) {
            throw new CustomError(MessageCode.AUTO_TRANSLATE_NETWORK_ERROR, `${response?.status} ${response?.statusText}`);
        }
        if (this.shouldCatchErrorCode.has(response.data.errorCode)) {
            throw new CustomError(MessageCode.PROVIDER_INPUT_ERROR, Editor.I18n.t(`${MainName}.error.YOUDAO.error`, {
                errorCode: response.data.errorCode,
                message: this.shouldCatchErrorCode.get(response.data.errorCode) || '',
            }));
        }
        if (response.data.errorCode !== '0') {
            throw new CustomError(MessageCode.PROVIDER_INPUT_ERROR, Editor.I18n.t(`${MainName}.error.YOUDAO.errorCode`, {
                errorCode: response.data.errorCode,
            }));
        }
        const translateResponse: YouDaoTranslateResponse = response.data as YouDaoTranslateResponse;
        return {
            translation: translateResponse.translation[0].split('\n'),
            status: parseInt(translateResponse.errorCode),
        };
    }

    /**
     * 生成有道翻译API的请求签名
     */
    generateSign(appKey: string, appSecret: string, query: string, salt: string, curtime: string): string {
        const str = `${appKey}${query}${salt}${curtime}${appSecret}`;
        return CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
    }

    truncate(str: string): string {
        const len = str.length;
        if (len <= 20) return str;
        else return `${str.substring(0, 10)}${len}${str.substring(len - 10, len)}`;
    }
}
