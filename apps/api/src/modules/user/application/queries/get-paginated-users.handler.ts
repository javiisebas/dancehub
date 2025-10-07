import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { CacheService, CacheTTL } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResponse, PaginatedUserRequest } from '@repo/shared';
import { User } from '../../domain/entities/user.entity';
import {
    IUserRepository,
    USER_REPOSITORY,
    UserField,
    UserRelations,
} from '../../domain/repositories/i-user.repository';
import { UserCacheKey } from '../../infrastructure/cache/user.cache-keys';

export class GetPaginatedUsersQuery extends GetPaginatedQueryEnhanced<PaginatedUserRequest> {}

@Injectable()
export class GetPaginatedUsersHandler extends BaseGetPaginatedHandler<
    User,
    PaginatedUserRequest,
    UserField,
    UserRelations
> {
    constructor(
        @Inject(USER_REPOSITORY) repository: IUserRepository,
        private readonly cache: CacheService,
    ) {
        super(repository);
    }

    async execute(
        query: GetPaginatedQueryEnhanced<PaginatedUserRequest>,
    ): Promise<PaginatedResponse<User>> {
        const cacheKey = UserCacheKey.paginated(query.data);
        return this.cache.getOrSet(cacheKey, async () => super.execute(query), {
            ttl: CacheTTL.SHORT,
        });
    }
}
