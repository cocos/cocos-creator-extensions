import 'reflect-metadata';
import { MainName } from '../core/service/util/global';
import { container } from 'tsyringe';
import MainIPC from '../core/ipc/MainIPC';

const mainIPC = container.resolve(MainIPC);

const get: any[] = [
    {
        url: `/${MainName}/resource-list`,
        async handle(req: any, res: any, next: Function){
            console.debug('request resource-list');
            const resourceList = await mainIPC.getResourceList();
            console.debug(resourceList);
            res.json(resourceList);
        },
    },
    {
        url: `/${MainName}/resource-bundle`,
        async handle(req: any, res: any, next: Function){
            console.debug('request resource-bundle');
            const resourceBundle = await mainIPC.getResourceBundle([]);
            console.debug(resourceBundle);
            res.json(resourceBundle);
        },
    },
];

export {
    get,
};
