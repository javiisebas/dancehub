import { BaseCacheKey, CacheService } from '@api/modules/core/cache';
import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

class HealthCheckCacheKey extends BaseCacheKey {
    constructor() {
        super('health', 'check');
    }
}

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
    constructor(private readonly cacheService: CacheService) {
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        try {
            const testKey = new HealthCheckCacheKey();

            await this.cacheService.set(testKey, 'test', { ttl: 1 });
            const value = await this.cacheService.get(testKey);
            const isHealthy = value === 'test';
            await this.cacheService.del(testKey);

            const result = this.getStatus(key, isHealthy, {
                message: isHealthy ? 'Redis is up' : 'Redis is down',
            });

            if (isHealthy) {
                return result;
            }

            throw new HealthCheckError('Redis health check failed', result);
        } catch (error) {
            const result = this.getStatus(key, false, {
                message: 'Redis is down',
            });
            throw new HealthCheckError('Redis health check failed', result);
        }
    }
}
