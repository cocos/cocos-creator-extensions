'use strict';

import { Pin, declarePin, PinAction } from '../pin';

/**
 * Unknown
 * 未知类型的引脚
 */
class UnknownPin extends Pin<
{
    value: any;
}
> {
    static type = 'unknown';

    color = '';
    line = 'normal';
    details = {
        value: null,
    };

    contentSlot = /*html*/``;
    childrenSlot = [];
}
declarePin(UnknownPin);
