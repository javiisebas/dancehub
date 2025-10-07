import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { CacheService, CacheTTL } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
    IUserRepository,
    USER_REPOSITORY,
    UserField,
    UserRelations,
} from '../../domain/repositories/i-user.repository';
import { UserCacheKey } from '../../infrastructure/cache/user.cache-keys';

export class GetUserByFieldQuery extends GetByFieldQuery<UserField, UserRelations> {}

@Injectable()
export class GetUserByFieldHandler extends BaseGetByFieldHandler<User, UserField, UserRelations> {
    constructor(
        @Inject(USER_REPOSITORY) repository: IUserRepository,
        private readonly cache: CacheService,
    ) {
        super(repository);
    }

    async execute(query: GetByFieldQuery<UserField, UserRelations>): Promise<User | null> {
        if (query.field === 'id') {
            return this.cache.getOrSet(
                UserCacheKey.byId(query.value as string),
                async () => super.execute(query),
                { ttl: CacheTTL.MEDIUM },
            );
        }
        return super.execute(query);
    }
}
