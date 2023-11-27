/* eslint-disable semi */
import ITranslateItem from './ITranslateItem';
import ILanguageConfig from './ILanguageConfig';

export default interface ITranslateData {
    locale: Intl.BCP47LanguageTag
    items: Map<string, ITranslateItem>
    languageConfig: ILanguageConfig;
}
