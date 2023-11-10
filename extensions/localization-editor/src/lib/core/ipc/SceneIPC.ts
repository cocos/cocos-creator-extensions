/* eslint-disable prefer-rest-params */
import { singleton } from 'tsyringe';
import { ResourceBundle } from '../../../../@types/runtime/l10n';
import ISceneThread from '../../scene/ISceneThread';
import IScanOption from '../entity/messages/IScanOption';
import { MessageCode } from '../entity/messages/MainMessage';
import { CustomError } from '../error/Errors';
import { MainName } from '../service/util/global';

@singleton()
export default class SceneIPC implements ISceneThread {
    private async executeSceneScript<T>(method: string, ...args: any): Promise<T> {
        try {
            return await Editor.Message.request('scene', 'execute-scene-script', {
                name: MainName,
                method,
                args,
            }) as T;
        } catch (e) {
            // @ts-ignore
            if (e.message?.startsWith(CustomError.NAME) ?? false) {
                // @ts-ignore
                throw new CustomError(parseInt(e.message.split(':')[1]));
            } else {
                console.warn(...arguments);
                console.warn(e);
                throw new CustomError(MessageCode.SCENE_ERROR);
            }
        }
    }

    async scan(scanOptions: IScanOption[]): Promise<void> {
        return this.executeSceneScript('scan', ...arguments);
    }

    async uninstall(scanOptions: IScanOption[]): Promise<void> {
        return this.executeSceneScript('uninstall', ...arguments);
    }

    async onSceneReady(uuid: string): Promise<void> {
        return this.executeSceneScript('onSceneReady', ...arguments);
    }

    async preview(locale: Intl.BCP47LanguageTag): Promise<void> {
        return this.executeSceneScript('preview', ...arguments);
    }

    async reloadResourceData(): Promise<boolean> {
        return this.executeSceneScript('reloadResourceData', ...arguments);
    }

    async addResourceBundle(language: Intl.BCP47LanguageTag, resourceBundle: ResourceBundle): Promise<void> {
        return this.executeSceneScript('addResourceBundle', ...arguments);
    }

    async removeResourceBundle(language: Intl.BCP47LanguageTag): Promise<void> {
        return this.executeSceneScript('removeResourceBundle', ...arguments);
    }
}
