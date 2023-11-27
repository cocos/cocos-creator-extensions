import AdmZip from 'adm-zip';
import { basename, join } from 'path';

// creating archives
const zip = new AdmZip();

// add local file
const folders: string[] = [
    join(__dirname, '../webpack-dist'),
    join(__dirname, '../i18n'),
    join(__dirname, '../static'),
    join(__dirname, '../runtime-node-modules/node_modules'),
];

const files: string[] = [
    join(__dirname, '../extension_cover.png'),
    join(__dirname, '../package.json'),
    join(__dirname, '../README.zh-CN.md'),
    join(__dirname, '../README.md'),

];
for (let index = 0; index < folders.length; index++) {
    const f = folders[index];
    zip.addLocalFolder(f, basename(f));
}
for (let index = 0; index < files.length; index++) {
    const f = files[index];
    zip.addLocalFile(f);
}

// get everything as a buffer
// or write everything to disk
// npm run pack ./dist -> the third parameter is the location of the zip output
zip.writeZip(process.argv[2] ? join(process.argv[2], 'localization-editor.zip') : join(__dirname, '../localization-editor.zip'));

// ... more examples in the wiki