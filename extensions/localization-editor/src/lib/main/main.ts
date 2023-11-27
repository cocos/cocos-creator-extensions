import 'reflect-metadata';
import '../core/container-registry';
import { container } from 'tsyringe';
import { ConfigDirectoryStructure, ResourceDirectoryStructure } from '../core/entity/directory-structure/directory-structure';
import MainThread from './MainThread';
import SceneIPC from '../core/ipc/SceneIPC';
import EditorMessageService from '../core/service/EditorMessageService';

export const methods = container.resolve(MainThread);

export const load = async () => {
    // cacheService.clear();

    container.resolve(ConfigDirectoryStructure).init(Editor.Project.path);
    container.resolve(ResourceDirectoryStructure).init(Editor.Project.path);
    container.resolve(MainThread).readConfig().then();

};

export const unload = () => {
};
