import { BaseCacheKey, CacheService } from '@api/modules/core/cache';
import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import { LogService } from '../logger/services/logger.service';

class ThrottlerCacheKey extends BaseCacheKey {
    constructor(identifier: string) {
        super('throttler', identifier);
    }
}

@Injectable()
export class CustomThrottlerStorageService implements ThrottlerStorage {
    constructor(
        private readonly logger: LogService,
        private readonly cacheService: CacheService,
    ) {}

    async increment(
        key: string,
        ttl: number,
        limit: number,
        blockDuration: number,
    ): Promise<ThrottlerStorageRecord> {
        const currentTime = Date.now();
        const cacheKey = new ThrottlerCacheKey(key);
        const currentRecord = await this.cacheService.get<ThrottlerStorageRecord>(cacheKey);

        const record: ThrottlerStorageRecord = currentRecord || {
            totalHits: 0,
            isBlocked: false,
            timeToExpire: currentTime + ttl * 1000,
            timeToBlockExpire: currentTime,
        };

        if (record.isBlocked) {
            if (currentTime >= record.timeToBlockExpire) {
                record.isBlocked = false;
                record.totalHits = 1;
                record.timeToExpire = currentTime + ttl * 1000;
            } else {
                return record;
            }
        } else {
            record.totalHits += 1;

            if (record.totalHits > limit) {
                record.isBlocked = true;
                record.timeToBlockExpire = currentTime + blockDuration * 1000;
                this.logger.warn(
                    `Throttle limit exceeded for key: ${key}. Blocked until ${new Date(record.timeToBlockExpire).toISOString()}`,
                    'ThrottlerStorage',
                );
            } else {
                record.timeToExpire = currentTime + ttl * 1000;
            }
        }

        const cacheTTL = record.isBlocked ? blockDuration : ttl;
        await this.cacheService.set(cacheKey, record, { ttl: cacheTTL });

        return record;
    }

    async clear(key: string): Promise<void> {
        const cacheKey = new ThrottlerCacheKey(key);
        await this.cacheService.del(cacheKey);
    }

    async getRecord(key: string): Promise<ThrottlerStorageRecord | null> {
        const cacheKey = new ThrottlerCacheKey(key);
        return await this.cacheService.get<ThrottlerStorageRecord>(cacheKey);
    }

    async clearAll(): Promise<void> {
        await this.cacheService.delPattern('throttler:*');
    }
}
