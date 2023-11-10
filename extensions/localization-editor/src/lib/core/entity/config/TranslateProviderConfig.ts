import ITranslateProviderConfig, { SupportedTranslateProvider } from './ITranslateProviderConfig';

export default class TranslateProviderConfig implements ITranslateProviderConfig {
    constructor(
        public name: SupportedTranslateProvider,
        public url?: string,
        public appKey?: string,
        public appSecret?: string,
        public qps?: number,
    ) {}

    static parse(config: ITranslateProviderConfig): TranslateProviderConfig {
        return new TranslateProviderConfig(
            config.name,
            config.url,
            config.appKey,
            config.appSecret,
            config.qps,
        );
    }

    clone(): TranslateProviderConfig {
        return new TranslateProviderConfig(
            this.name,
            this.url,
            this.appKey,
            this.appSecret,
            this.qps,
        );
    }
}
