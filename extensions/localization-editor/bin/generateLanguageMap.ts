import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import * as ts from 'typescript';
const lanMap: Record<string, string[]> = {};
readFileSync(join(__dirname, '..', 'resources', 'language.txt'), 'utf-8')
    .split(process.platform === 'win32' ? '\r\n' : '\n')
    .filter(Boolean)
    .forEach((line) => {
        try {
            const locale = new Intl.Locale(line);
            const arr = lanMap[locale.language] ?? [];
            arr.push(line);
            lanMap[locale.language] = arr;
        } catch (e) {
            console.error(e);
            console.log(line);
        }
    });
// console.log(JSON.stringify(lanMap));
const propertyAssignments: ts.PropertyAssignment[] = [];
for (const [key, value] of Object.entries(lanMap)) {
    propertyAssignments.push(
        ts.factory.createPropertyAssignment(
            ts.factory.createStringLiteral(key),
            ts.factory.createArrayLiteralExpression(
                value.map((str) => ts.factory.createStringLiteral(str)),
                false,
            ),
        ),
    );
}

//writeFileSync(join(__dirname, '..', 'src/panel/share/scripts', 'LanguageMap.ts'), csv, 'utf-8');

const file = ts.createSourceFile('source.ts', '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const mapDecl = ts.factory.createVariableStatement(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
        [
            ts.factory.createVariableDeclaration(
                ts.factory.createIdentifier('languageMap'),
                undefined,
                undefined,
                ts.factory.createObjectLiteralExpression(propertyAssignments, true),
            ),
        ],
        ts.NodeFlags.Const,
    ),
);
const result = printer.printNode(ts.EmitHint.Unspecified, mapDecl, file);
try {
    const distPath = join(__dirname, '..', 'src/panel/share/scripts/libs', 'languageMap.ts');
    ensureDirSync(dirname(distPath));
    writeFileSync(distPath, result, { encoding: 'utf-8' });
} catch (error) {
    console.error(error);
}

