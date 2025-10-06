import { BaseTranslatableEntity } from '@api/common/abstract/domain';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheTTL } from './constants';
import { TranslatableCacheKeys } from './translatable-cache-keys';

@Injectable()
export class TranslatableCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    private getKeys(entityName: string): TranslatableCacheKeys {
        return new TranslatableCacheKeys(entityName);
    }

    async getEntity<T extends BaseTranslatableEntity>(
        entityName: string,
        id: string,
        fetcher: () => Promise<T>,
        ttl: number = CacheTTL.MEDIUM,
        reviver?: (data: any) => T,
    ): Promise<T> {
        const keys = this.getKeys(entityName);
        const key = keys.entity(id);
        const cached = await this.cacheManager.get<any>(key);
        if (cached) {
            return reviver ? reviver(cached) : cached;
        }
        const value = await fetcher();
        await this.cacheManager.set(key, value, ttl * 1000);
        return value;
    }

    async invalidateEntity(entityName: string, id: string): Promise<void> {
        const keys = this.getKeys(entityName);
        await this.cacheManager.del(keys.entity(id));
    }

    async invalidateTranslation(entityName: string, id: string, locale: string): Promise<void> {
        const keys = this.getKeys(entityName);
        await this.cacheManager.del(keys.translation(id, locale));
    }

    async invalidateTranslations(entityName: string, id: string): Promise<void> {
        const keys = this.getKeys(entityName);
        const store = this.cacheManager.store;
        if (typeof store.keys === 'function') {
            const cacheKeys = await store.keys(keys.translationPattern(id));
            if (cacheKeys && cacheKeys.length > 0) {
                await Promise.all(cacheKeys.map((key) => this.cacheManager.del(key)));
            }
        }
        await this.cacheManager.del(keys.translations(id));
    }

    async invalidateAll(entityName: string, id: string): Promise<void> {
        const keys = this.getKeys(entityName);
        const store = this.cacheManager.store;
        if (typeof store.keys === 'function') {
            const cacheKeys = await store.keys(keys.entityPattern(id));
            if (cacheKeys && cacheKeys.length > 0) {
                await Promise.all(cacheKeys.map((key) => this.cacheManager.del(key)));
            }
        }
    }

    async invalidateAllByLocale(entityName: string, id: string, locale: string): Promise<void> {
        const keys = this.getKeys(entityName);
        await this.cacheManager.del(keys.translation(id, locale));
    }
}
