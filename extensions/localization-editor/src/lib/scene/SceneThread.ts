import { container, singleton } from 'tsyringe';
import ScanOption from '../core/entity/messages/ScanOption';
import ScanService from '../core/service/scanner/ScanService';
import EditorMessageService from '../core/service/EditorMessageService';
import { MessageCode } from '../core/entity/messages/MainMessage';
import { CustomError } from '../core/error/Errors';
import TranslateData, { TranslateDataObject } from '../core/entity/translate/TranslateData';
import MainIPC from '../core/ipc/MainIPC';
import ISceneThread from './ISceneThread';
import L10nComponentManagerService from '../core/service/component/l10n-component-manager-service';
import IScanOption from '../core/entity/messages/IScanOption';
import L10nManagerWrapper from '../core/wrapper/l10n-manager-wrapper';
import type { ResourceBundle, ResourceData } from '../../../@types/runtime/l10n';

@singleton()
export default class SceneThread implements ISceneThread {
    constructor(
        protected l10nManagerWrapper: L10nManagerWrapper,
        protected editorMessageService: EditorMessageService,
        protected mainIpc: MainIPC,
        protected l10nComponentManagerService: L10nComponentManagerService,
    ) { }

    async scan(scanOptions: IScanOption[]): Promise<void> {
        const dirty = await this.editorMessageService.queryDirty();
        if (dirty) {
            throw new Error(`${CustomError.NAME}:${MessageCode.EDITOR_DIRTY}`);
        }
        if (scanOptions.length === 0) {
            throw new Error(`${CustomError.NAME}:${MessageCode.SCAN_OPTION_EMPTY}`);
        } else {
            scanOptions = scanOptions.map((option) => ScanOption.parse(option));
        }
        const scanService = container.resolve(ScanService);
        const translateDataObject = await this.mainIpc.getTranslateDataObject();
        const translateData = TranslateData.fromObject(translateDataObject);
        const result = await scanService.scan(
            translateData,
            scanOptions.map(it => ScanOption.parse(it)),
            (finished, total) => {
                this.editorMessageService.scanProgress(finished, total);
            },
        );
        await this.mainIpc.saveTranslateData(translateData.locale, result);
        await this.editorMessageService.refreshAssets();
    }

    async uninstall(scanOptions: IScanOption[]): Promise<void> {
        const dirty = await this.editorMessageService.queryDirty();
        if (dirty) {
            throw new Error(`${CustomError.NAME}:${MessageCode.EDITOR_DIRTY}`);
        }
        const scanService = container.resolve(ScanService);
        await scanService.scanAndUnInstall(scanOptions.map(it => ScanOption.parse(it)), (finished, total) => {
            this.editorMessageService.scanProgress(finished, total);
        });
        await this.l10nManagerWrapper.uninstall();
        await this.l10nManagerWrapper.releaseAsset();
        // await this.editorMessageService.softReload();
    }

    async onSceneReady(uuid: string): Promise<void> {
        this.l10nComponentManagerService.onSceneReady(uuid);
    }

    addResourceBundle(language: Intl.BCP47LanguageTag, resourceBundle: ResourceBundle): Promise<void> {
        return this.l10nManagerWrapper.addResourceBundle(language, resourceBundle);
    }

    preview(locale: Intl.BCP47LanguageTag): Promise<void> {
        return this.l10nManagerWrapper.preview(locale);
    }

    reloadResourceData(): Promise<boolean> {
        return this.l10nManagerWrapper.reloadResourceData();
    }

    removeResourceBundle(language: Intl.BCP47LanguageTag): Promise<void> {
        return this.l10nManagerWrapper.removeResourceBundle(language);
    }
}
