import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cache.set(key, value, { ttl } as any);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async reset(): Promise<void> {
    await this.cache.reset();
  }

  async onModuleDestroy() {
    const redisClient = (this.cache.store as any).getClient();
    redisClient.quit();
  }
}
