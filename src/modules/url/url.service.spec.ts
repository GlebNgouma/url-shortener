import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UidService } from '../../services/uid/uid.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

describe('UrlService', () => {
  let urlService: UrlService;
  let uidService: DeepMocked<UidService>;
  let configService: DeepMocked<ConfigService>;
  let databaseService: DeepMockProxy<DatabaseService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: UidService, useValue: createMock<UidService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        { provide: DatabaseService, useValue: mockDeep<DatabaseService>() },
      ],
    }).compile();
    const app = module.createNestApplication();
    urlService = module.get<UrlService>(UrlService);
    uidService = module.get(UidService);
    configService = module.get(ConfigService);
    configService.getOrThrow.mockReturnValue('localhost:3000');
    databaseService = module.get(DatabaseService);
    await app.init();
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe(`create`, () => {
    it(`devrait creer une nouvelle url`, async () => {
      const uid = 'abcdef';
      const payload = {
        redirect: 'https://airbnb.com',
        title: 'Airbnb',
        description: 'A hotel site',
      };
      const mockedUrl = {
        ...payload,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `localhost:3000/${uid}`,
      };
      uidService.generateUid.mockReturnValueOnce(uid);
      databaseService.url.create.mockResolvedValueOnce(mockedUrl);
      const result = await urlService.create(payload);
      expect(result).toEqual(mockedUrl);
    });
  });
});
