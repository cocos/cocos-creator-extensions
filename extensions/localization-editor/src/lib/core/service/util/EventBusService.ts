import EventEmitter from 'events';
import { singleton } from 'tsyringe';
import { IEventBusEventMap } from './IEventMap';

@singleton()
export default class EventBusService extends EventEmitter {
    on<T extends keyof IEventBusEventMap>(eventName: T, listener: IEventBusEventMap[T]): this {
        return super.on(eventName, listener);
    }
    once<T extends keyof IEventBusEventMap>(eventName: T, listener: IEventBusEventMap[T]): this {
        return super.once(eventName, listener);
    }
    off<T extends keyof IEventBusEventMap>(eventName: T, listener: IEventBusEventMap[T]): this {
        return super.off(eventName, listener);
    }
    emit<T extends keyof IEventBusEventMap>(eventName: T, ...args: Parameters<IEventBusEventMap[T]>): boolean {
        return super.emit(eventName, ...args);
    }
}
