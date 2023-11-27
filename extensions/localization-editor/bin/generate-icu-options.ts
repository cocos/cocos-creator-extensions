import { readFileSync, writeFileSync } from 'fs-extra';
import * as prettier from 'prettier';

let icuComponentContent = '// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ auto generate by script don\'t edit ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓\n';

const createProperty = (name: string, ccType: string, returnType: string, icuType: string, optionName: string, propName?: string): string =>
    `@property({
    type: ${ccType},
    group: '${icuType}',
    visible(this: ICUComponent) {
        return this.type === ICUType.${icuType};
    },
})
set ${name}(value: ${returnType}) {
    this.${optionName}${propName ? `.${propName}` : ''} = value;
    this.render()
}
get ${name}(): ${returnType} {
    return this.${optionName}${propName ? `.${propName}` : ''} as ${returnType};
}\n`;

icuComponentContent += '/************************** NumberFormatOptions **************************/\n';
icuComponentContent += `@property({ visible: false })
numberFormatOptions: NumberFormatOptions = {useGrouping: false}\n`;
[
    ['numberStyle', 'Enum(VirtualEnum)', 'string', 'style'],
    ['currency', 'CCString', 'string'],
    ['currencySign', 'Enum(VirtualEnum)', 'string'],
    ['currencyDisplay', 'Enum(VirtualEnum)', 'string'],
    ['useGrouping', 'CCBoolean', 'boolean'],
    ['minimumIntegerDigits', 'CCInteger', 'number'],
    ['minimumFractionDigits', 'CCInteger', 'number'],
    ['maximumFractionDigits', 'CCInteger', 'number'],
    ['minimumSignificantDigits', 'CCInteger', 'number'],
    ['maximumSignificantDigits', 'CCInteger', 'number'],
].forEach((it: string[]) => {
    icuComponentContent += createProperty(it[0], it[1], it[2], 'Number', 'numberFormatOptions', it.length > 3 ? it[3] : it[0]);
    icuComponentContent += '\n';
});

icuComponentContent += '/************************** DateTimeFormatOptions **************************/\n';
icuComponentContent += `@property({ visible: false })
dateTimeFormatOptions: DateTimeFormatOptions = {}\n\n`;
[
    ['dateTimeLocaleMatcher', 'Enum(VirtualEnum)', 'string', 'localeMatcher'],
    ['weekday', 'Enum(VirtualEnum)', 'string'],
    ['era', 'Enum(VirtualEnum)', 'string'],
    ['year', 'Enum(VirtualEnum)', 'string'],
    ['month', 'Enum(VirtualEnum)', 'string'],
    ['day', 'Enum(VirtualEnum)', 'string'],
    ['hour', 'Enum(VirtualEnum)', 'string'],
    ['minute', 'Enum(VirtualEnum)', 'string'],
    ['second', 'Enum(VirtualEnum)', 'string'],
    ['timeZoneName', 'Enum(VirtualEnum)', 'string'],
    ['formatMatcher', 'Enum(VirtualEnum)', 'string'],
    ['hour12', 'CCBoolean', 'boolean'],
    ['timeZone', 'CCString', 'string'],
].forEach((it: string[]) => {
    icuComponentContent += createProperty(it[0], it[1], it[2], 'DateTime', 'dateTimeFormatOptions', it.length > 3 ? it[3] : it[0]);
    icuComponentContent += '\n';
});

icuComponentContent += '/************************** RelativeTimeOptions **************************/\n';
icuComponentContent += `@property({ visible: false })
relativeTimeFormatOptions: RelativeTimeFormatOptions = {}\n\n`;
[
    ['relativeTimeLocaleMatcher', 'Enum(VirtualEnum)', 'string', 'localeMatcher'],
    ['numeric', 'Enum(VirtualEnum)', 'string'],
    ['relativeTimeStyle', 'Enum(VirtualEnum)', 'string', 'style'],
].forEach((it) => {
    icuComponentContent += createProperty(it[0], it[1], it[2], 'RelativeTime', 'relativeTimeFormatOptions', it.length > 3 ? it[3] : it[0]);
    icuComponentContent += '\n';
});

icuComponentContent += `@property({ visible: false })
_relativeTimeUnit: RelativeTimeFormatUnit = 'second'\n\n`;
icuComponentContent += createProperty('relativeTimeUnit', 'Enum(VirtualEnum)', 'string', 'RelativeTime', '_relativeTimeUnit');
icuComponentContent += '\n';

icuComponentContent += '// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ auto generate by script don\'t edit ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑';

let fileContent = readFileSync('src/assets/components/ICUComponent.ts', 'utf-8');

fileContent = fileContent.replace(/.*↓[.\s\S]*[\n\r]*↑/g, icuComponentContent);

const prettierConfig = JSON.parse(readFileSync('.prettierrc.json', 'utf-8'));

delete prettierConfig['$schema'];

fileContent = prettier.format(fileContent, prettierConfig as prettier.Options);

writeFileSync('src/assets/components/ICUComponent.ts', fileContent, 'utf-8');
