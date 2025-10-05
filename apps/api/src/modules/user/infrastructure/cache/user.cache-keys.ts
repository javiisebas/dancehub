import { BaseCacheKey } from '@api/modules/core/cache';

export class UserCacheKey extends BaseCacheKey {
    private constructor(identifier: string, suffix?: string) {
        super('user', identifier, suffix);
    }

    static byEmail(email: string): UserCacheKey {
        return new UserCacheKey('email', email);
    }
}
