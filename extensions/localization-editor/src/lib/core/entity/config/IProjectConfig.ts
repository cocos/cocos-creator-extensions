/* eslint-disable semi */
import ScanOption from '../messages/ScanOption';
import TranslateProviderConfig from './TranslateProviderConfig';

export default interface IProjectConfig {
    localLanguage?: Intl.BCP47LanguageTag
    scanOptions?: ScanOption[]
}
