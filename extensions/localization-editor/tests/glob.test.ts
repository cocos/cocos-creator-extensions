import glob from 'glob';
import * as path from 'path';

describe('测试glob', () => {
    test('src', async (): Promise<void> => {
        const files = glob.sync('src/**/*.{ts,js,vue,less,css,json}');
        for (const file of files) {
            console.log(path.basename(file, path.extname(file)));
            console.log(file.replace(/^src/, 'webpack-dist'));
        }
    });
});
