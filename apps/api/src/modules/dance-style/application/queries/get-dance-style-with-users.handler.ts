import { BaseCacheKey, CacheService, CacheTag, CacheTTL } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class GetDanceStyleWithUsersQuery {
    constructor(
        public readonly id: string,
        public readonly includeUsers?: boolean,
    ) {}
}

@Injectable()
export class GetDanceStyleWithUsersHandler {
    constructor(
        @Inject(DANCE_STYLE_REPOSITORY) private readonly repository: IDanceStyleRepository,
        private readonly cache: CacheService,
    ) {}

    async execute({ id, includeUsers }: GetDanceStyleWithUsersQuery): Promise<DanceStyle> {
        const relations = includeUsers ? ['users'] : [];

        const cacheKey = new BaseCacheKey('dance-style', id).withTags(
            CacheTag.entity('DanceStyle', id),
        );

        if (includeUsers) {
            cacheKey
                .withRelations('users')
                .withTags(CacheTag.entityRelation('DanceStyle', id, 'users'));
        }

        return this.cache.getOrSet(
            cacheKey,
            async () => await this.repository.findById(id, { relations }),
            { ttl: CacheTTL.MEDIUM },
        );
    }
}
