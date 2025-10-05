import { LogService } from '@api/modules/core/logger/services/logger.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BaseCacheKey } from './base-cache-key';

export interface CacheOptions {
    ttl?: number;
}

@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly logger: LogService,
    ) {}

    async get<T>(key: BaseCacheKey): Promise<T | null> {
        try {
            const value = await this.cacheManager.get<T>(key.toString());
            return value ?? null;
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error(
                `Cache get failed for key: ${key.toString()}`,
                errorStack,
                'CacheService',
            );
            return null;
        }
    }

    async set<T>(key: BaseCacheKey, value: T, options?: CacheOptions): Promise<void> {
        try {
            const ttlMs = options?.ttl ? options.ttl * 1000 : undefined;
            await this.cacheManager.set(key.toString(), value, ttlMs);
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error(
                `Cache set failed for key: ${key.toString()}`,
                errorStack,
                'CacheService',
            );
        }
    }

    async del(key: BaseCacheKey): Promise<void> {
        try {
            await this.cacheManager.del(key.toString());
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error(
                `Cache del failed for key: ${key.toString()}`,
                errorStack,
                'CacheService',
            );
        }
    }

    async delPattern(pattern: string): Promise<void> {
        try {
            const store = this.cacheManager.store;

            if (typeof store.keys === 'function') {
                const keys = await store.keys(pattern);
                if (keys && keys.length > 0) {
                    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
                }
            } else {
                this.logger.warn(
                    `Cache store does not support pattern deletion: ${pattern}`,
                    'CacheService',
                );
            }
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error(
                `Cache delPattern failed for pattern: ${pattern}`,
                errorStack,
                'CacheService',
            );
        }
    }

    async getOrSet<T>(
        key: BaseCacheKey,
        factory: () => Promise<T>,
        options?: CacheOptions,
    ): Promise<T> {
        try {
            const cached = await this.get<T>(key);
            if (cached !== null) {
                return cached;
            }

            const value = await factory();
            this.set(key, value, options).catch(() => {});
            return value;
        } catch (error) {
            throw error;
        }
    }

    async has(key: BaseCacheKey): Promise<boolean> {
        try {
            const value = await this.cacheManager.get(key.toString());
            return value !== undefined && value !== null;
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error(
                `Cache has failed for key: ${key.toString()}`,
                errorStack,
                'CacheService',
            );
            return false;
        }
    }

    async reset(): Promise<void> {
        try {
            await this.cacheManager.reset();
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error('Cache reset failed', errorStack, 'CacheService');
        }
    }
}
