import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CacheService } from '../src/core/cache/cache.service';
import { DatabaseService } from '../src/database/database.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import helmet from 'helmet';

let app: INestApplication;
let server: any;
let cacheService: CacheService;
let databaseService: DatabaseService;

beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.init();
  server = app.getHttpServer();
  cacheService = app.get<CacheService>(CacheService);
  databaseService = app.get<DatabaseService>(DatabaseService);
});

afterEach(async () => {
  //reinitialiser apres chaque test la base de données et le cache
  await cacheService.reset();
  await databaseService.reset();
});

afterAll(async () => {
  await app.close();
});

export { server };
