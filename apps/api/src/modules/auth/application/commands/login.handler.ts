import {
    UpdateUserCommand,
    UpdateUserHandler,
} from '@api/modules/user/application/commands/update-user.handler';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { LoginResponse } from '@repo/shared';
import { AuthTokenService } from '../../domain/services/auth-token.service';

export class LoginCommand {
    constructor(public readonly user: User) {}
}

@Injectable()
export class LoginHandler {
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly updateUserHandler: UpdateUserHandler,
    ) {}

    async execute({ user }: LoginCommand): Promise<LoginResponse> {
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
}
