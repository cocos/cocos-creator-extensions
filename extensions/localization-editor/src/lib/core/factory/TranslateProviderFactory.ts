import { singleton } from 'tsyringe';
import TranslateProviderConfig from '../entity/config/TranslateProviderConfig';

@singleton()
export default class TranslateProviderFactory {
    // getProvider
    createProvider(provider: TranslateProviderConfig): TranslateProviderConfig {
        const providerConfig = provider.clone();
        switch (provider.name) {
            case 'YOUDAO':
                providerConfig.url = 'https://openapi.youdao.com/api';
                providerConfig.qps = 500;
                break;
            case 'GOOGLE':
                providerConfig.url = 'https://google-translate1.p.rapidapi.com/language/translate/v2';
                providerConfig.qps = 5;
                break;
            default:
                break;
        }
        return providerConfig;
    }
}
