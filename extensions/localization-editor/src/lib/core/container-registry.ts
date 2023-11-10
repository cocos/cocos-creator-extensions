import { join } from 'path';
import { container } from 'tsyringe';
import POWriter from './writer/POWriter';
import CSVWriter from './writer/CSVWriter';
import XLSXWriter from './writer/XLSXWriter';
import POReader from './reader/POReader';
import CSVReader from './reader/CSVReader';
import { readJSONSync } from 'fs-extra';
import { PluralRules } from './type/type';
import YouDaoRepository from './repository/translate/YouDaoRepository';
import XLSXReader from './reader/XLSXReader';

container.register('PluralRules', {
    useValue: (() => {
        return readJSONSync(join(__dirname, '..', '..', 'static', 'plural-rules', 'plural-rules.json')) as PluralRules;
    })(),
});

container.register('Writer', { useClass: POWriter });
container.register('Writer', { useClass: CSVWriter });
container.register('Writer', { useClass: XLSXWriter });

container.register('Reader', { useClass: POReader });
container.register('Reader', { useClass: CSVReader });
container.register('Reader', { useClass: XLSXReader });

container.register('TranslateRepository', { useClass: YouDaoRepository });
