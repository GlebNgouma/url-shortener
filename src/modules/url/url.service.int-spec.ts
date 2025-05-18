import { app } from '../../../test/setup';
import { UrlService } from './url.service';
import { DatabaseService } from '../../database/database.service';

describe(`UrlService Integration Tests`, () => {
  let urlService: UrlService;
  let databaseService: DatabaseService;

  beforeEach(() => {
    urlService = app.get<UrlService>(UrlService);
    databaseService = app.get<DatabaseService>(DatabaseService);
  });

  describe(`create`, () => {
    it(`devrait creer une nouvelle url`, async () => {
      const payload = {
        redirect: 'https://www.airbnb.com',
        title: 'Airbnb',
      };
      const url = await urlService.create(payload);
      const persistedUrl = await databaseService.url.findUnique({
        where: { url: url.url },
      });
      expect(url).toEqual(persistedUrl);
    });
  });
});
