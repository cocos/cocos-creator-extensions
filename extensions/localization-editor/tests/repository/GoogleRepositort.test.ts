import { container } from 'tsyringe';
import GoogleRepository from '../../src/lib/core/repository/translate/GoogleRepository';
import YouDaoRepository from '../../src/lib/core/repository/translate/YouDaoRepository';

describe('Google Translate Test', () => {
    test('translate', async () => {
        const repo = container.resolve(YouDaoRepository);
        const result = await repo.translate({
            appKey: '2aab55e212acb39f',
            appSecret: 'GbgSmGopbnGHoGJqRgOwRGGnTvAv0WLm',
            url: 'https://openapi.youdao.com/api',
            // appKey: 'google-translate1.p.rapidapi.com',
            // appSecret: '0055a908a8mshceae4722859c0e9p16c8a5jsn6db2e7bd4a08',
            // url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            from: 'zh-CN',
            to: 'en',
            query: ['你好', '世界'],
        });
        console.log(result);
    });
});
