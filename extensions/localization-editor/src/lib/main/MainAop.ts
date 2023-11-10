import { container } from 'tsyringe';
import MainThread from './MainThread';

const MainAop = () => {
    return new Proxy(container.resolve(MainThread), {
        get(target: MainThread, p: string | symbol, receiver: any): any {
            console.warn(target);
            return new Proxy(Reflect.get(target, p, receiver), {
                apply(target: any, thisArg: any, argArray: any[]): any {
                    console.debug('Localization Editor 主进程调用:', p);
                    return Reflect.apply(target, thisArg, argArray);
                },
            });
        },
    });
};

export default MainAop;
