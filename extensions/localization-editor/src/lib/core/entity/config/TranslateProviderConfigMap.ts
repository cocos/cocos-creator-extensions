import ITranslateProviderConfigMap from './ITranslateProviderConfigMap';
import { SupportedTranslateProvider } from './ITranslateProviderConfig';
import TranslateProviderConfig from './TranslateProviderConfig';

export default class TranslateProviderConfigMap implements ITranslateProviderConfigMap {
    static ConfigsName = 'TranslateProviderConfigMap';

    constructor(
        public currentProviderConfig?: SupportedTranslateProvider,
        public translateProviderConfigs: Partial<Record<SupportedTranslateProvider, TranslateProviderConfig>> = {},
    ) {}

    static parse(configMap: ITranslateProviderConfigMap) {
        const configs: Partial<Record<SupportedTranslateProvider, TranslateProviderConfig>> = {};
        for (const [key, value] of Object.entries(configMap.translateProviderConfigs)) {
            if (key && value) {
                configs[key as SupportedTranslateProvider] = TranslateProviderConfig.parse(value);
            }
        }
        return new TranslateProviderConfigMap(
            configMap.currentProviderConfig,
            configs,
        );
    }
}
