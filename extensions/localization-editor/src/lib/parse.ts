import { join } from 'path';
import { readJSONSync, writeJSONSync } from 'fs-extra';

const pluralsPath = join(__dirname, '..', 'static', 'plural-rules', 'plurals.json');
const cldrContent = readJSONSync('/Users/bppleman/Downloads/cldr-41.0.0-json-full/cldr-core/supplemental/plurals.json');
const cardinal = cldrContent['supplemental']['plurals-type-cardinal'];
const plurals: {
    [language: string]: string[]
} = {};
for (const caKey in cardinal) {
    const caValue = cardinal[caKey];
    const keys = Object.keys(caValue).map((it) => {
        return it.split('-').pop();
    }).filter((it) => it) as string[];
    plurals[caKey] = keys;
}
console.log(plurals);
writeJSONSync(pluralsPath, plurals, {
    spaces: 4,
});
