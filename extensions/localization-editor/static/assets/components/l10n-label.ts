// @ts-ignore
import { _decorator } from 'cc';
// @ts-ignore
import { EDITOR } from 'cc/env';
import l10n from '../core/l10n-manager';
import L10nComponent from './l10n-component';

const {
    ccclass,
    property,
    executeInEditMode,
    menu,
    help,
} = _decorator;

@ccclass('L10nLabel')
@executeInEditMode(true)
@menu('LocalizationEditor/L10nLabel')
@help('i18n:localization-editor.component.help')
export default class L10nLabel extends L10nComponent {
    @property({ visible: false })
    _key = '';

    @property({
        tooltip: 'i18n:localization-editor.component.key1'
    })
    set key(value: string) {
        this._key = value;
        this.render();
    }

    get key(): string {
        return this._key;
    }
    @property({ visible: false })
    _count = 0;
    @property({
        tooltip: 'i18n:localization-editor.component.count'
    })
    set count(value: number) {
        this._count = value;
        this.render();
    }

    get count(): number {
        return this._count;
    }

    onLoad() {
        if (typeof super.onLoad === 'function') {
            super.onLoad();
        }
    }

    render() {
        const translatedString = l10n.t(this._key, { count: this._count });
        if (typeof this.label === 'undefined' || typeof translatedString === 'undefined') {
            return;
        }
        if (EDITOR) {
            this.preview(translatedString);
        } else {
            this.label!.string = translatedString;
        }
    }
}
