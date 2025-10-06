import { Command } from '@api/common/abstract/application/commands.abstract';
import { BusinessException } from '@api/common/exceptions/business.exception';
import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CacheDomain } from '@api/modules/core/cache/constants';
import {
    CreateUserCommand,
    CreateUserHandler,
} from '@api/modules/user/application/commands/create-user.handler';
import {
    UpdateUserCommand,
    UpdateUserHandler,
} from '@api/modules/user/application/commands/update-user.handler';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateUserRequest, LoginResponse } from '@repo/shared';
import { AuthPasswordService } from '../../domain/services/auth-password.service';
import { AuthTokenService } from '../../domain/services/auth-token.service';
import { UserRegisteredEvent } from '../events/user-registered.event';

export class RegisterCommand extends Command<CreateUserRequest> {}

@Injectable()
export class RegisterHandler {
    constructor(
        private readonly authPasswordService: AuthPasswordService,
        private readonly authTokenService: AuthTokenService,
        private readonly cacheService: CacheService,
        private readonly createUserHandler: CreateUserHandler,
        private readonly eventEmitter: EventEmitter2,
        private readonly updateUserHandler: UpdateUserHandler,
    ) {}

    async execute({ data }: RegisterCommand): Promise<LoginResponse> {
        const { password, confirmPassword, ...userData } = data;

        if (password !== confirmPassword) {
            throw new BusinessException({ code: 'auth.passwordMismatch' });
        }

        const hashedPassword = await this.authPasswordService.hashPassword(password);

        const user = await this.createUserHandler.execute(
            new CreateUserCommand({
                email: userData.email,
                name: userData.name,
                password: hashedPassword,
                confirmPassword: hashedPassword,
            }),
        );

        await this.sendEmailVerification(user);

        const { accessToken, refreshToken } = await this.authTokenService.generateTokens(user);

        await this.updateUserHandler.execute(new UpdateUserCommand(user.id, { refreshToken }));

        user.updateRefreshToken(refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
            accessToken,
            refreshToken,
        };
    }

    private async sendEmailVerification(user: User): Promise<void> {
        const token = await this.authTokenService.generateToken();

        const cacheKey = new BaseCacheKey(CacheDomain.AUTH, 'email-verification', token);
        await this.cacheService.set(cacheKey, user.id);

        this.eventEmitter.emit(
            'auth.user.registered',
            new UserRegisteredEvent(user.id, user.email, user.firstName ?? user.name, token),
        );
    }
}
