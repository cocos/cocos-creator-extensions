/* eslint-disable semi */
import { TranslateItemKey, TranslateItemValue } from '../../type/type'

export default interface ICSVTranslateItem {
    key: TranslateItemKey
    sourceValue: TranslateItemValue
    targetValue: TranslateItemValue
}
