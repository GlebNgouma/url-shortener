import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from './database/database.service';
import { CacheService } from './core/cache/cache.service';

describe('AppService', () => {
  let appService: AppService;
  let cacheService: DeepMocked<CacheService>;

  //Avant que chaque test ne soit executer, nous creons un module de test
  //et nous injectons le service que nous voulons tester
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: LoggerService, useValue: createMock<LoggerService>() },
        { provide: CacheService, useValue: createMock<CacheService>() },
        { provide: DatabaseService, useValue: mockDeep<DatabaseService>() },
      ],
    }).compile();

    appService = app.get<AppService>(AppService); //recupere l'instance du service
    cacheService = app.get(CacheService); //recupere l'instance du service
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      cacheService.get.mockResolvedValue('value from cache');
      const result = await appService.getHello(); //lorsque l'on appelle la methode getHello du service, on s'attend a ce qu'elle retourne "Hello World!"
      expect(result).toBe('Hello World!');
    });
  });
});
