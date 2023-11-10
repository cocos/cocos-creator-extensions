/* eslint-disable semi */
export default interface ITranslateProviderConfig {
    name: SupportedTranslateProvider
    url?: string
    appKey?: string
    appSecret?: string
    qps?: number
}

export type SupportedTranslateProvider = 'YOUDAO' | 'GOOGLE'

export const TranslateProviderSupportedLanguages = new Map<SupportedTranslateProvider, string[]>([
    ['YOUDAO', ['zh-CHS', 'zh-CHT', 'en', 'ja', 'ko', 'fr', 'es', 'pt', 'it', 'ru', 'vi', 'de', 'ar', 'id', 'af', 'bs', 'bg', 'yue', 'ca', 'hr', 'cs', 'da', 'nl', 'et', 'fj', 'fi', 'el', 'ht', 'he', 'hi', 'mww', 'hu', 'sw', 'tlh', 'lv', 'lt', 'ms', 'mt', 'no', 'fa', 'pl', 'otq', 'ro', 'sr-Cyrl', 'sr-Latn', 'sk', 'sl', 'sv', 'ty', 'th', 'to', 'tr', 'uk', 'ur', 'cy', 'yua', 'sq', 'am', 'hy', 'az', 'bn', 'eu', 'be', 'ceb', 'co', 'eo', 'tl', 'fy', 'gl', 'ka', 'gu', 'ha', 'haw', 'is', 'ig', 'ga', 'jw', 'kn', 'kk', 'km', 'ku', 'ky', 'lo', 'la', 'lb', 'mk', 'mg', 'ml', 'mi', 'mr', 'mn', 'my', 'ne', 'ny', 'ps', 'pa', 'sm', 'gd', 'st', 'sn', 'sd', 'si', 'so', 'su', 'tg', 'ta', 'te', 'uz', 'xh', 'yi', 'yo', 'zu']],
    ['GOOGLE', ['af', 'ak', 'am', 'ar', 'as', 'ay', 'az', 'be', 'bg', 'bh', 'bn', 'bs', 'ca', 'ceb', 'co', 'cs', 'cy', 'da', 'de', 'dv', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'ha', 'haw', 'he', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'is', 'it', 'iw', 'ja', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'kri', 'ku', 'ky', 'la', 'lb', 'lg', 'ln', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'nso', 'ny', 'om', 'or', 'pa', 'pl', 'ps', 'pt', 'qu', 'ro', 'ru', 'rw', 'sa', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tr', 'ts', 'tt', 'ug', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo', 'zh', 'zh-CN', 'zh-TW', 'zu']],
]);
