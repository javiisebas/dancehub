import { BaseCacheKey } from '@api/modules/core/cache';

export class DanceStyleCacheKey extends BaseCacheKey {
    private constructor(identifier: string, suffix?: string) {
        super('dance-style', identifier, suffix);
    }

    static bySlug(slug: string): DanceStyleCacheKey {
        return new DanceStyleCacheKey('slug', slug);
    }
}
