import { Injectable } from '@nestjs/common';
import { LoggerService } from './core/logger/logger.service';
import { DatabaseService } from './database/database.service';
import { CacheService } from './core/cache/cache.service';

@Injectable()
export class AppService {
  private context = 'AppService';
  constructor(
    private readonly logger: LoggerService,
    private readonly databaseService: DatabaseService,
    private readonly cache: CacheService,
  ) {}

  async getHello() {
    const start = Date.now();

    this.logger.log('calling log from inside getHello method', this.context, {
      userId: 1,
    });
    await this.databaseService.user.findMany();
    await this.cache.set('key', 'value from cache', 1000);
    const valueFromCache = await this.cache.get('key');
    console.log('valueFromCaches', valueFromCache);

    const duration = Date.now() - start;
    console.log(`getHello executed in ${duration}ms`);
    return 'Hello World!';
  }

  async testCache(): Promise<any> {
    const cached = await this.cache.get('my-key');
    if (cached) return { fromCache: true, data: cached };

    const data = { value: Math.random(), time: new Date() };
    await this.cache.set('my-key', data, 10); // 10s TTL
    return { fromCache: false, data };
  }
}
