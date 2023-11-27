import ILanguageInfo from '../../../builder/ILanguageInfo';
import IPolyFillInfo from '../../../builder/IPolyfillInfo';
import { ITaskOptions } from '../../../builder/ITaskOptions';
import { CustomError } from '../../error/Errors';
import EditorMessageService from '../EditorMessageService';

export type CustomEventMap = {
    /**
     * 当所有资源更新的广播
     */
    updateAllLanguageConfig: () => void
    /**
     * 当 dump 更新时广播的这个数据
     */
    onDumpUpdated: (dump: Dump) => void
    /**
     * 当构建的参数更新的时候的广播
     */
    onBuilderUpdated (options: Readonly<ITaskOptions>, key?: string): void
    /**
     * 在面板中发出修改参数的广播
     * @param key 形如 packages.${pkgName}.xxx
     * @param value 对应选项项的值
     * @param isError 是否出现检验错误
     */
    changeBuilderOptions (key: string, value: IPolyFillInfo | ILanguageInfo | string, isError: boolean): void
    /**
     * 收到了来自主进程的错误
     * @param error
     */
    onCustomError (error: InstanceType<typeof CustomError> | Error): void;
};
/** 事件总线的 */
export type IEventBusEventMap = EditorMessageService & CustomEventMap;
