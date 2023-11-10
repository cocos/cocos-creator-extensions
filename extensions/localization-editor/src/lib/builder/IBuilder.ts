import ILanguageConfig from '../core/entity/translate/ILanguageConfig';

/* eslint-disable semi */
export default interface IBuilder {
    getICUlPolyfillFileInfos(): Promise<{ name: string, uuid: string }[]>;  
    getAllLanguagesInfo(): Promise<ILanguageConfig[]>;
}
