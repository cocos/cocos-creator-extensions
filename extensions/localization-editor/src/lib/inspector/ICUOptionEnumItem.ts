export class EnumItem {
    constructor(
        public name: string,
        public value: string,
    ) {}
}

const Default = new EnumItem('Default', '');
const BestFit = new EnumItem('BestFit', 'best fit');
const Lookup = new EnumItem('Lookup', 'lookup');
const Long = new EnumItem('Long', 'long');
const Short = new EnumItem('Short', 'short');
const Narrow = new EnumItem('Narrow', 'narrow');
const Numeric = new EnumItem('Numeric', 'numeric');
const Digit2 = new EnumItem('2-Digit', '2-digit');
const Always = new EnumItem('Always', 'always');
const Auto = new EnumItem('Auto', 'auto');
const Decimal = new EnumItem('Decimal', 'decimal');
const Percent = new EnumItem('Percent', 'percent');
const Currency = new EnumItem('Currency', 'currency');
const Standard = new EnumItem('Standard', 'standard');
const Accounting = new EnumItem('Accounting', 'accounting');
const Symbol = new EnumItem('Symbol', 'symbol');
const Code = new EnumItem('Code', 'code');
const Name = new EnumItem('Name', 'name');
const Second = new EnumItem('Second', 'second');
const Minute = new EnumItem('Minute', 'minute');
const Hour = new EnumItem('Hour', 'hour');
const Day = new EnumItem('Day', 'day');
const Month = new EnumItem('Month', 'month');
const Year = new EnumItem('Year', 'year');

/************************** NumberFormatOptions **************************/
export const numberFormatOptionsMap = new Map<string, EnumItem[]>([
    ['numberStyle', [Default, Decimal, Percent, Currency]],
    ['currencySign', [Default, Standard, Accounting]],
    ['currencyDisplay', [Default, Symbol, Code, Name]],
]);

/************************** DateTimeFormatOptions **************************/
export const dateTimeFormatOptionsMap = new Map<string, EnumItem[]>([
    ['dateTimeLocaleMatcher', [Default, BestFit, Lookup]],
    ['weekday', [Default, Long, Short, Narrow]],
    ['era', [Default, Long, Short, Narrow]],
    ['year', [Default, Numeric, Digit2]],
    ['month', [Default, Long, Short, Narrow, Numeric, Digit2]],
    ['day', [Default, Numeric, Digit2]],
    ['hour', [Default, Numeric, Digit2]],
    ['minute', [Default, Numeric, Digit2]],
    ['second', [Default, Numeric, Digit2]],
    ['timeZoneName', [Default, Long, Short]],
    ['formatMatcher', [Default, BestFit, Lookup]],
]);

/************************** RelativeTimeFormatOptions **************************/
export const relativeTimeFormatOptionsMap = new Map<string, EnumItem[]>([
    ['relativeTimeLocaleMatcher', [Default, BestFit, Lookup]],
    ['numeric', [Default, Always, Auto]],
    ['relativeTimeStyle', [Default, Long, Short, Narrow]],
    ['relativeTimeUnit', [Default, Second, Minute, Hour, Day, Month, Year]],
]);

export type OptionMap = Map<string, EnumItem[]>;

export const enumMap = new Map<string, OptionMap>([
    ['Number', numberFormatOptionsMap],
    ['DateTime', dateTimeFormatOptionsMap],
    ['RelativeTime', relativeTimeFormatOptionsMap],
]);
