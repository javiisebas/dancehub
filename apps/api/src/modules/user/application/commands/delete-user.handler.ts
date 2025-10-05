import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { CacheService } from '@api/modules/core/cache';
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';
import { UserCacheKey } from '../../infrastructure/cache/user.cache-keys';

export class DeleteUserCommand extends DeleteCommand {}

@Injectable()
export class DeleteUserHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: IUserRepository,
        private readonly cache: CacheService,
    ) {}

    async execute({ id }: DeleteUserCommand): Promise<void> {
        await this.repository.findById(id);
        await this.repository.delete(id);

        await this.cache.del(UserCacheKey.byId(id));
        await this.cache.delPattern('user:list:*');
    }
}
