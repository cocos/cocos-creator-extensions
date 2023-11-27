/**
 * 这里统一处理消息的发送，普通的，场景的，DB 的
 */
import { MessageType } from './internal';

interface ISceneMessage {
    method: string;
    args: any[],
    callback: Function;
}

type MessageCallback = (...args: any[]) => void;

export class MessageMgr {

    static _instance: MessageMgr | null = null;

    public static get Instance(): MessageMgr {
        if (!this._instance) {
            this._instance = new MessageMgr();
        }
        return this._instance;
    }

    private eventCallbacks: Map<string, MessageCallback[]> = new Map();

    public send(eventNames: string | string[], ...args: any[]): void {
        // 模拟发送消息的操作
        const events = Array.isArray(eventNames) ? eventNames : [eventNames];
        for (const eventName of events) {
            console.debug(`发送消息 (${eventName}) ${args.length > 0 ? ':' + JSON.stringify(args) : ''}`);

            // 触发特定事件的注册的回调函数来处理消息
            const callbacks = this.eventCallbacks.get(eventName);
            if (callbacks) {
                callbacks.forEach((callback) => {
                    callback(...args);
                });
            }
        }
    }

    public unregisterAll() {
        this.eventCallbacks.clear();
        this.sceneMessages = [];
    }

    /**
     * 注册一个或多个事件的消息回调函数
     * @param eventNames
     * @param callback
     */
    public register(eventNames: string | string[], callback: MessageCallback): void {
        const events = Array.isArray(eventNames) ? eventNames : [eventNames];
        for (const eventName of events) {
            if (!this.eventCallbacks.has(eventName)) {
                this.eventCallbacks.set(eventName, []);
            }
            this.eventCallbacks.get(eventName)?.push(callback);
        }
    }

    /**
     * 取消注册一个或多个事件的消息回调函数
     * @param eventNames
     * @param callback
     */
    public unregister(eventNames: string | string[], callback: MessageCallback): void {
        const events = Array.isArray(eventNames) ? eventNames : [eventNames];
        for (const eventName of events) {
            const callbacks = this.eventCallbacks.get(eventName);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index !== -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }

    // --- Scene ---

    isSceneReady: boolean | undefined = undefined;

    sceneMessages: ISceneMessage[] = [];

    async checkSceneReady(): Promise<boolean> {
        if (!this.isSceneReady) {
            this.isSceneReady = await Editor.Message.request('scene', 'query-is-ready');
        }
        return this.isSceneReady;
    }

    setSceneReady(ready: boolean) {
        this.isSceneReady = ready;

        for (let i = 0; i < this.sceneMessages.length; i++) {
            const options = this.sceneMessages[i];
            Editor.Message.request('scene', 'execute-scene-script', {
                name: 'shader-graph',
                method: options.method,
                args: options.args,
            }).then((response: any) => {
                options.callback(null, response);
            });
        }
        if (ready) {
            MessageMgr.Instance.send(MessageType.SceneReady);
        }
    }

    async callSceneMethod(method: string, args?: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            const callback = function(error: any, data: any) {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(data);
            };

            this.checkSceneReady().then(() => {
                if (!this.isSceneReady) {
                    return this.sceneMessages.push({
                        method,
                        args: args || [],
                        callback,
                    });
                }
                Editor.Message.request('scene', 'execute-scene-script', {
                    name: 'shader-graph',
                    method,
                    args: args || [],
                }).then((response: any) => {
                    callback(null, response);
                });
            });
        });
    }
}
