import { load } from 'js-yaml';
import { readFileSync } from 'fs-extra';

describe('js-yaml', () => {
    test('parse', () => {
        const doc = load(readFileSync('index.yaml', 'utf-8'));
        console.log(doc);
    });
});
