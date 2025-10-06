import { GetByIdQuery } from '@api/common/abstract/application';
import { BaseCacheKey, CacheService, CacheTTL } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../domain/repositories/i-dance-style.repository';

export class GetDanceStyleWithUsersQuery extends GetByIdQuery {}

@Injectable()
export class GetDanceStyleWithUsersHandler {
    constructor(
        @Inject(DANCE_STYLE_REPOSITORY) private readonly repository: IDanceStyleRepository,
        private readonly cache: CacheService,
    ) {}

    async execute({ id }: GetDanceStyleWithUsersQuery): Promise<DanceStyle> {
        const cacheKey = new BaseCacheKey('dance-style', id);

        return this.cache.getOrSet(cacheKey, async () => await this.repository.findById(id), {
            ttl: CacheTTL.MEDIUM,
        });
    }
}
