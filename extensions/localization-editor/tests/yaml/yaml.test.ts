import { parse } from 'yaml';
import { readFileSync } from 'fs-extra';

describe('yaml', () => {
    test('parse', () => {
        const doc = parse(readFileSync('index.yaml', 'utf8'));
        console.log(doc);
    });
});
