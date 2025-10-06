import { LogService } from '@api/modules/core/logger/services/logger.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { BaseCacheKey } from './base-cache-key';
import { CacheTag, CacheTagsManager } from './cache-tags';
import { RelationshipManager } from './relationship-manager';

export interface CacheOptions {
    ttl?: number;
}

@Injectable()
export class CacheService {
    private readonly tagsManager = new CacheTagsManager();

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly logger: LogService,
        @Optional() private readonly relationshipManager?: RelationshipManager,
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

            const tags = key.getTags();
            if (tags.length > 0) {
                this.tagsManager.registerKey(key.toString(), tags);
            }
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
            const keyString = key.toString();
            await this.cacheManager.del(keyString);
            this.tagsManager.removeKey(keyString);
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
            this.tagsManager.clear();
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error('Cache reset failed', errorStack, 'CacheService');
        }
    }

    async invalidateByTags(...tags: CacheTag[]): Promise<void> {
        try {
            const keys = this.tagsManager.getKeysByTags(tags);
            if (keys.length > 0) {
                await Promise.all(
                    keys.map(async (key) => {
                        await this.cacheManager.del(key);
                        this.tagsManager.removeKey(key);
                    }),
                );
                this.logger.log(
                    `Invalidated ${keys.length} cache entries by tags: ${tags.map((t) => t.toString()).join(', ')}`,
                    'CacheService',
                );
            }
        } catch (error) {
            const errorStack = error instanceof Error ? error.stack : String(error);
            this.logger.error(
                `Cache invalidation by tags failed: ${tags.map((t) => t.toString()).join(', ')}`,
                errorStack,
                'CacheService',
            );
        }
    }

    async invalidateEntity(
        entityName: string,
        id: string | number,
        options?: { includeRelations?: boolean },
    ): Promise<void> {
        const tags: CacheTag[] = [
            CacheTag.entity(entityName, id),
            CacheTag.entityCollection(entityName),
        ];

        if (options?.includeRelations && this.relationshipManager) {
            const affected = this.relationshipManager.getAffectedEntities(entityName, id);
            for (const { entity, relation } of affected) {
                if (relation) {
                    tags.push(CacheTag.entityRelation(entity, id, relation));
                }
                tags.push(CacheTag.entityCollection(entity));
            }
        }

        await this.invalidateByTags(...tags);
    }
}
