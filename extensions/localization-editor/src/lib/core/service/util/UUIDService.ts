import { singleton } from 'tsyringe';

@singleton()
export default class UUIDService {
    /**
     * Generate a version 4 UUID
     */
    public v4(): string {
        const v4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
        return this.compress(v4);
    }

    /**
     * compress a UUID to a short string
     */
    public compress(uuid: string): string {
        if (typeof Editor !== 'undefined') {
            return Editor.Utils.UUID.compressUUID(uuid, false);
        } else {
            return uuid;
        }
    }
}
