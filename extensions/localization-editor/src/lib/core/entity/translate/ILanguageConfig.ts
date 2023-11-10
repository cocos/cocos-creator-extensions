/* eslint-disable semi */
export default interface ILanguageConfig {
    bcp47Tag: string
    providerTag?: string
    translateFinished: number
    translateTotal: number
    compileFinished: number
    compileTotal: number
}
