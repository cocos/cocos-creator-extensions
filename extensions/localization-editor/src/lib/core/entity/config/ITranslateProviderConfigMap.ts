/* eslint-disable semi */
import { SupportedTranslateProvider } from './ITranslateProviderConfig';
import TranslateProviderConfig from './TranslateProviderConfig';

export default interface ITranslateProviderConfigMap {
    currentProviderConfig?: SupportedTranslateProvider
    translateProviderConfigs: Partial<Record<SupportedTranslateProvider, TranslateProviderConfig>>
}
