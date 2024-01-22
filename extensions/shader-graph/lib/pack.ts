import AdmZip from 'adm-zip';
import { basename, join } from 'path';

// creating archives
const zip = new AdmZip();

// add folders
[
    join(__dirname, '../node_modules'),
    join(__dirname, '../dist'),
    join(__dirname, '../i18n'),
    join(__dirname, '../static'),
    join(__dirname, '../shader-node'),
    join(__dirname, '../readme'),
].forEach((folder) => {
    zip.addLocalFolder(folder, basename(folder));
});

// add files
[
    join(__dirname, '../package.json'),
    join(__dirname, '../README.zh-CN.md'),
    join(__dirname, '../README.md'),

].forEach((file) => {
    zip.addLocalFile(file);
});

zip.writeZip(process.argv[2] ? join(process.argv[2], 'shader-graph.zip') : join(__dirname, '../shader-graph.zip'));
