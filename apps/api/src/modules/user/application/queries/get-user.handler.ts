import { BaseCacheKey, CacheService, CacheTag, CacheTTL } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';

export class GetUserQuery {
    constructor(
        public readonly id: string,
        public readonly includeDanceStyles?: boolean,
        public readonly includePayment?: boolean,
        public readonly includeStorage?: boolean,
    ) {}
}

@Injectable()
export class GetUserHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: IUserRepository,
        private readonly cache: CacheService,
    ) {}

    async execute({
        id,
        includeDanceStyles,
        includePayment,
        includeStorage,
    }: GetUserQuery): Promise<User> {
        const relations: string[] = [];

        if (includeDanceStyles) {
            relations.push('danceStyles');
        }
        if (includePayment) {
            relations.push('customer', 'subscriptions');
        }
        if (includeStorage) {
            relations.push('storages');
        }

        const cacheKey = new BaseCacheKey('user', id).withTags(CacheTag.entity('User', id));

        if (relations.length > 0) {
            cacheKey
                .withRelations(...relations)
                .withTags(...relations.map((rel) => CacheTag.entityRelation('User', id, rel)));
        }

        return this.cache.getOrSet(
            cacheKey,
            async () => await this.repository.findById(id, { relations }),
            { ttl: CacheTTL.MEDIUM },
        );
    }
}
