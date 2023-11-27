/* eslint-disable semi */

import type { ResourceBundle } from '../../../../@types/runtime/l10n';

export default interface IL10nManagerWrapper {
    preview: (locale: Intl.BCP47LanguageTag) => Promise<void>
    reloadResourceData: () => Promise<boolean>
    addResourceBundle: (language: Intl.BCP47LanguageTag, resourceBundle: ResourceBundle) => Promise<void>
    removeResourceBundle: (language: Intl.BCP47LanguageTag) => Promise<void>
}
