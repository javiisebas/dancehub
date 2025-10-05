import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { CacheService } from '@api/modules/core/cache';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UpdateUserRequest } from '@repo/shared';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';
import { UserCacheKey } from '../../infrastructure/cache/user.cache-keys';

export class UpdateUserCommand extends UpdateCommand<UpdateUserRequest> {}

@Injectable()
export class UpdateUserHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly repository: IUserRepository,
        private readonly cache: CacheService,
    ) {}

    async execute({ id, data }: UpdateUserCommand): Promise<User> {
        const user = await this.repository.findById(id);

        if (data.email && data.email !== user.email) {
            const existingUser = await this.repository.findByEmail(data.email);
            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email already exists');
            }
            user.updateEmail(data.email);
        }

        if (data.name) {
            user.updateName(data.name);
        }

        if (data.refreshToken !== undefined) {
            user.updateRefreshToken(data.refreshToken);
        }

        const updatePayload: any = {
            email: user.email,
            name: user.name,
            updatedAt: new Date(),
        };

        if (data.refreshToken !== undefined) {
            updatePayload.refreshToken = user.refreshToken;
        }

        if (data.status) {
            updatePayload.status = data.status;
        }

        const updatedUser = await this.repository.update(id, updatePayload);

        await this.cache.del(UserCacheKey.byId(updatedUser.id));
        await this.cache.delPattern('user:list:*');

        return updatedUser;
    }
}
