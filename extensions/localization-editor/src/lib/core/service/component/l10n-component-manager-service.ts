// 这个模块用于管理编辑器中 i18n 组件的生命周期
import { join } from 'path';
module.paths.push(join(Editor.App.path, 'node_modules'));
import 'reflect-metadata';

import { Component, js } from 'cc';
import { singleton } from 'tsyringe';
import MainIPC from '../../ipc/MainIPC';
import type { L10nLabel } from '../../../../../@types/runtime/l10n';
import IAssociation from '../../entity/translate/IAssociation';
import SceneProcessor from '../scanner/processor/SceneProcessor';
import EditorMessageService from '../EditorMessageService';

@singleton()
export default class L10nComponentManagerService {
    constructor(
        public mainIpc: MainIPC,
        public editorMessageService: EditorMessageService,
    ) {}

    protected tempAssociation: IAssociation = {};
    onSceneReady(uuid: string) {
        this.tempAssociation.sceneUuid = uuid;
        this.tempAssociation.reference = uuid;
    }
    _onComponentAdd: typeof this.onComponentAdd = this.onComponentAdd.bind(this);
    _onComponentRemoved: typeof this.onComponentRemoved = this.onComponentRemoved.bind(this);
    async onComponentAdd(component: Component) {
        const I18nLabelClass: typeof L10nLabel | null = js.getClassByName(SceneProcessor.L10nLabelComponentName) as any as typeof L10nLabel;
        if (I18nLabelClass && component instanceof I18nLabelClass) {
            const key = component.key;
            if (key) {
                this.tempAssociation.nodeUuid = component.node.uuid;
                await this.mainIpc.addAssociation(key, this.tempAssociation);
            }
        }
    }
    async onComponentRemoved(component: Component) {
        const I18nLabelClass: typeof L10nLabel | null = js.getClassByName(SceneProcessor.L10nLabelComponentName) as any as typeof L10nLabel;
        if (I18nLabelClass && component instanceof I18nLabelClass) {
            const key = component.key;
            if (key) {
                this.tempAssociation.nodeUuid = component.node.uuid;
                await this.mainIpc.removeAssociation(key, this.tempAssociation);
            }
        }
    }

    protected initialized = false;

    async register(cce: CCE): Promise<void> {
        if (!this.initialized) {
            const ready = await this.editorMessageService.queryIsReady();
            if (ready) {
                const sceneId = await this.editorMessageService.queryCurrentScene();
                this.onSceneReady(sceneId);
            }
            console.debug('L10nComponentManagerService register');
            cce.Component.on('added', this._onComponentAdd);
            cce.Component.on('removed', this._onComponentRemoved);
            this.initialized = true;
        }
    }

    unregister(cce: CCE) {
        if (this.initialized) {
            console.debug('L10nComponentManagerService unregister');
            cce.Component.off('added', this._onComponentAdd);
            cce.Component.off('removed', this._onComponentRemoved);
            this.initialized = false;
        }
    }
}
