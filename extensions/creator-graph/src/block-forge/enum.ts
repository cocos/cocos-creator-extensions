/**
 * 存储 enum 管理
 */

export type EnumType = {
    name: string,
    value: number,
};

export interface DeclareRegisterEnum {
    type: string;
    name: string;
}

const enumMap: Map<string, EnumType[]> = new Map();
const dynamicEnumMap: Map<string, EnumType[]> = new Map();
const enumEventMap: Map<string, Function[]> = new Map();

export function getEnumByType(type: string) {
    return enumMap.get(type) || [];
}

export function getDynamicEnumByType(type: string) {
    return dynamicEnumMap.get(type) || [];
}

function emitEventByType(type: string) {
    const eventList = enumEventMap.get(type) || [];
    eventList.forEach((event) => event());
}

/**
 * 用于动态声明枚举
 * @param options
 */
export function declareDynamicEnumToType(options: DeclareRegisterEnum) {
    const enumList = dynamicEnumMap.get(options.type) || [];
    if (!enumList.find((item) => item.name === options.name)) {
        enumList.push({
            name: options.name,
            value: enumList.length,
        });
        updateDynamicEnumMap(options.type, enumList);
        return true;
    }
    return false;
}

export function changeDynamicEnumValue(type: string, newValue: string, oldValue: string) {
    const enumList = dynamicEnumMap.get(type) || [];
    const index = enumList.findIndex((item) => item.name === oldValue);
    if (index !== -1) {
        enumList[index].name = newValue;
        updateDynamicEnumMap(type, enumList);
    }
}

export function removeDynamicEnumToType(type: string, singleEnum: string) {
    const enumList = dynamicEnumMap.get(type) || [];
    const index = enumList.findIndex((item) => item.name === singleEnum);
    if (index !== -1) {
        enumList.splice(index, 1);
        updateDynamicEnumMap(type, enumList);
    }
}

export function declareEnum(type: string, ccEnum: { [key: string]: any }) {
    updateEnumMap(type, ccEnumToList(ccEnum));
}

export function clearEnum() {
    enumMap.clear();
    enumMap.forEach((value, type) => removeEnumObserver(type));
}

export function clearDynamicEnum() {
    dynamicEnumMap.clear();
    dynamicEnumMap.forEach((value, type) => removeEnumObserver(type));
}

export function addEnumObserver(type: string, func: any) {
    const eventList = enumEventMap.get(type) || [];
    eventList.push(func);
    enumEventMap.set(type, eventList);
}

export function removeEnumObserver(type: string) {
    enumEventMap.delete(type);
}

function ccEnumToList(ccEnum: any) {
    const enums = [];
    for (const name in ccEnum) {
        const v = ccEnum[name];
        if (Number.isInteger(v)) {
            enums.push({ name, value: v });
        }
    }
    enums.sort((a, b): number => (a.value as number) - (b.value as number));
    return enums;
}

function updateEnumMap(type: string, enumList: EnumType[]) {
    enumMap.set(type, enumList);
    emitEventByType(type);
}

function updateDynamicEnumMap(type: string, enumList: EnumType[]) {
    dynamicEnumMap.set(type, enumList);
    emitEventByType(type);
}
