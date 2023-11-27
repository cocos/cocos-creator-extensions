/* eslint-disable semi */
import IScanOption from '../core/entity/messages/IScanOption';
import { TranslateDataObject } from '../core/entity/translate/TranslateData'
import IL10nManagerWrapper from '../core/wrapper/il10n-manager-wrapper'

export default interface ISceneThread extends IL10nManagerWrapper {
    scan: (scanOptions: IScanOption[]) => Promise<void>

    uninstall: (scanOptions: IScanOption[]) => Promise<void>

    onSceneReady: (uuid: string) => Promise<void>
}
