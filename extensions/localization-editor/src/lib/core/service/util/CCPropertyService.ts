// noinspection JSMethodCanBeStatic
import * as cc from 'cc';
import { singleton } from 'tsyringe';
import SceneProcessor from '../scanner/processor/SceneProcessor';

@singleton()
export default class CCPropertyService {
    /** 当有 I18nComponent 隐藏 CC.Label 的 string*/
    hideCCLabelString() {
        cc.CCClass.Attr.setClassAttr(cc.Label, 'string', 'visible', function(this: cc.Label) { return !this.getComponent(SceneProcessor.L10nComponentName); });
    }
    /** 将 CC.Label 的 string 重新设置为可见*/
    resetCCLabelStringVisibility() {
        cc.CCClass.Attr.setClassAttr(cc.Label, 'string', 'visible', true);
    }
}
