import { Command } from '@api/common/abstract/application/commands.abstract';
import {
    UpdateUserCommand,
    UpdateUserHandler,
} from '@api/modules/user/application/commands/update-user.handler';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { LoginResponse, UserResponse } from '@repo/shared';
import { plainToInstance } from 'class-transformer';
import { AuthTokenService } from '../../domain/services/auth-token.service';

export class LoginCommand extends Command<{ user: User }> {}

@Injectable()
export class LoginHandler {
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly updateUserHandler: UpdateUserHandler,
    ) {}

    async execute({ data }: LoginCommand): Promise<LoginResponse> {
        const { user } = data;

        const { accessToken, refreshToken } = await this.authTokenService.generateTokens(user);

        await this.updateUserHandler.execute(new UpdateUserCommand(user.id, { refreshToken }));

        user.updateRefreshToken(refreshToken);

        return {
            user: plainToInstance(UserResponse, user, { excludeExtraneousValues: true }),
            accessToken,
            refreshToken,
        };
    }
}
