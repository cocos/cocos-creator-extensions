import { container } from 'tsyringe';
import UUIDService from '../../src/lib/core/service/util/UUIDService';

describe('测试本地化工具', () => {
    test('测试获取所有国际语言', () => {
        const uuidService = container.resolve(UUIDService);
        const uuid = uuidService.v4();
        console.log(uuid);
        console.log(uuidService.compress(uuid));
    });
});
