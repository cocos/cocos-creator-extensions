import 'reflect-metadata';
import '../core/container-registry';
import { container } from 'tsyringe';
import SceneThread from './SceneThread';
import CCPropertyService from '../core/service/util/CCPropertyService';
import L10nComponentManagerService from '../core/service/component/l10n-component-manager-service';

const sceneThread = container.resolve(SceneThread);
const ccPropertyService = container.resolve(CCPropertyService);
const l10nComponentManagerService = container.resolve(L10nComponentManagerService);

// 模块加载的时候触发的函数
export const load = () => {
    // cacheService.clear();
    ccPropertyService.hideCCLabelString();
    l10nComponentManagerService.register(cce).then();
};

// 模块卸载的时候触发的函数
export const unload = () => {
    l10nComponentManagerService.unregister(cce);
    ccPropertyService.resetCCLabelStringVisibility();
};

// 模块内定义的方法
export const methods = sceneThread;
