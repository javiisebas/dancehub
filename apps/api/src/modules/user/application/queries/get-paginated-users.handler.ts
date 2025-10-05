import { GetPaginatedQuery } from '@api/common/abstract/application/queries.abstract';
import { CacheService, CacheTTL } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedResponse, PaginatedUserRequest } from '@repo/shared';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';
import { UserCacheKey } from '../../infrastructure/cache/user.cache-keys';

export class GetPaginatedUsersQuery extends GetPaginatedQuery<PaginatedUserRequest> {}

@Injectable()
export class GetPaginatedUsersHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: IUserRepository,
        private readonly cache: CacheService,
    ) {}

    async execute({ data }: GetPaginatedUsersQuery): Promise<PaginatedResponse<User>> {
        const cacheKey = UserCacheKey.paginated(data);

        return this.cache.getOrSet(
            cacheKey,
            async () => {
                return await this.repository.paginate(data);
            },
            { ttl: CacheTTL.SHORT },
        );
    }
}
