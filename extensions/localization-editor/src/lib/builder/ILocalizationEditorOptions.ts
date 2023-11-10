/* eslint-disable semi */
import ILanguageInfo from './ILanguageInfo';
import IPolyFillInfo from './IPolyfillInfo';

export default interface ILocalizationEditorOptions {
    polyfillMap?: Record<UUID, IPolyFillInfo>,
    targetLanguageMap?: Record<Intl.BCP47LanguageTag, ILanguageInfo>,
    defaultLanguage?: Intl.BCP47LanguageTag,
    fallbackLanguage?: Intl.BCP47LanguageTag,
}
