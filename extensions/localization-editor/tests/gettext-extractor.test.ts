import { GettextExtractor, JsExtractors } from 'gettext-extractor';
import { join } from 'path';

// describe('', () => {
//     test('', () => {
//         const extractor = new GettextExtractor();
//         extractor
//             .createJsParser([
//                 JsExtractors.callExpression('i18n.t', {
//                     arguments: {
//                         text: 0,
//                     },
//                 }),
//             ])
//             .parseFile(join(__dirname, './intl/i18next.test.ts'));
//         extractor.printStats()
//     });
// });

const extractor = new GettextExtractor();
extractor
    .createJsParser([
        JsExtractors.callExpression('i18n.t', {
            arguments: {
                text: 0,
            },
        }),
    ])
    .parseFile('./intl/i18next.test.ts');
console.log(extractor.getMessages());
