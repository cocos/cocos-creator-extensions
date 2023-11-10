/**
 * 能够被面板索引的数组的每一项
 */
export default class Iterator<T = string> {
    public __key: string;
    constructor(public value: T) {
        this.__key = `${Date.now().toString()}-${Math.random()}`;
    }
}
