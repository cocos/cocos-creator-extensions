import { MessageCode, MessageMap } from '../entity/messages/MainMessage';

export interface ICustomError extends Error {
    status: MessageCode
}

export class CustomError extends Error implements ICustomError {
    static NAME = 'CustomError';

    constructor(
        public status: MessageCode,
        ...messages: string[]
    ) {
        let message: string;
        try {
            const elements = MessageMap.get(status)!().split('{}');
            message = elements.pop()!;
            message += ` ${messages.pop() ?? ''} `;
            for (const element of elements) {
                message += element;
                message += ` ${messages.pop() ?? ''} `;
            }
        } catch (e) {
            message = MessageMap.get(status)!();
        }
        super(message);
    }
}
