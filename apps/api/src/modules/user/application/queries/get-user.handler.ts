import { CacheService, CacheTTL } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';
import { UserCacheKey } from '../../infrastructure/cache/user.cache-keys';

export class GetUserQuery {
    constructor(public readonly id: string) {}
}

@Injectable()
export class GetUserHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: IUserRepository,
        private readonly cache: CacheService,
    ) {}

    async execute({ id }: GetUserQuery): Promise<User> {
        return this.cache.getOrSet(
            UserCacheKey.byId(id),
            async () => await this.repository.findById(id),
            { ttl: CacheTTL.MEDIUM },
        );
    }
}
