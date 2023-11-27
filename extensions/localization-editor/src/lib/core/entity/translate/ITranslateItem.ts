/* eslint-disable semi */
import TranslateItemType from './TranslateItemType';
import IAssociation from './IAssociation';

export default interface ITranslateItem {
    key: string
    value: string
    type: TranslateItemType
    isVariant: boolean
    associations: IAssociation[]
    _variants: ITranslateItem[]
}
