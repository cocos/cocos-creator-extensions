import { getLanguageDisplayName, languageMap } from './libs/languageMap';
import { MainName } from '../../../lib/core/service/util/global';
/**
 * 弹出选择语言
 * @param callback 选中语言的回调
 * @param excludes 禁用的语言
 */
export function popupLanguage(callback: (locale: string, displayName: string) => void, excludes: string[] = []) {
    const languageMapKeys = Object.keys(languageMap);
    const manualLocales: string[] = ['zh', 'en', 'fr', 'ru', 'ja', 'ko', 'es', 'ar'];
    const manualLocalesDisplayNames: string[] = manualLocales.map((locale) => getLanguageDisplayName(locale));

    const tempMenus: Editor.Menu.PopupOptions['menu'] = languageMapKeys
        .map((key) => {
            const menu: Editor.Menu.PopupOptions['menu'][number] = {
                label: getLanguageDisplayName(key),
                sublabel: key === manualLocales[manualLocales.length - 1] ? Editor.I18n.t(MainName + '.common_languages') : undefined,
                submenu: languageMap[key as keyof typeof languageMap]
                    .map((locale) => {
                        const displayName = getLanguageDisplayName(locale);
                        const menu: Editor.Menu.ContextMenuItem = {
                            label: displayName,
                            click: () => {
                                callback(locale, displayName ?? locale);
                            },
                            enabled: !excludes.includes(locale),

                        };
                        return menu;
                    })
                    .filter(Boolean),

            };
            return menu;
        })
        .filter(Boolean);

    const manualMenus: Editor.Menu.ContextMenuItem[] = tempMenus.filter((item) => manualLocalesDisplayNames.includes(item.label as string)).sort((a, b) => manualLocalesDisplayNames.indexOf(a.label!) - manualLocalesDisplayNames.indexOf(b.label!));
    const translatedMenus = tempMenus.filter((item) => !languageMapKeys.find((key) => item.label === key) && !manualMenus.includes(item)).sort((a, b) => (a.label ?? '').localeCompare(b.label ?? ''));
    const unTranslatedMenus = tempMenus.filter((item) => languageMapKeys.find((key) => item.label === key) && !manualMenus.includes(item)).sort();

    Editor.Menu.popup({ menu: [...manualMenus, { type: 'separator' }, ...translatedMenus, ...unTranslatedMenus] });
}
