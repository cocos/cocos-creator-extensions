import ILanguageConfig from './ILanguageConfig';

export default class LanguageConfig implements ILanguageConfig {
    constructor(
        public bcp47Tag: string,
        public providerTag?: string,
        public translateFinished: number = 0,
        public translateTotal: number = 0,
        public compileFinished: number = 0,
        public compileTotal: number = 0,
    ) {
    }

    equals(other: LanguageConfig): boolean {
        return this.bcp47Tag === other.bcp47Tag
            && this.providerTag === other.providerTag
            && this.translateFinished === other.translateFinished
            && this.translateTotal === other.translateTotal
            && this.compileFinished === other.compileFinished
            && this.compileTotal === other.compileTotal;
    }

    assign(other: LanguageConfig) {
        this.bcp47Tag = other.bcp47Tag;
        this.providerTag = other.providerTag;
        this.translateFinished = other.translateFinished;
        this.translateTotal = other.translateTotal;
        this.compileFinished = other.compileFinished;
        this.compileTotal = other.compileTotal;
    }

    static parse(config: ILanguageConfig): LanguageConfig {
        return new LanguageConfig(
            config.bcp47Tag,
            config.providerTag,
            config.translateFinished,
            config.translateTotal,
            config.compileFinished,
            config.compileTotal,
        );
    }

    clone(): LanguageConfig {
        return new LanguageConfig(
            this.bcp47Tag,
            this.providerTag,
            this.translateFinished,
            this.translateTotal,
            this.compileFinished,
            this.compileTotal,
        );
    }
}
