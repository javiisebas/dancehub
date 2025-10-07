import { Command } from '@api/common/abstract/application/commands.abstract';
import { BusinessException } from '@api/common/exceptions/business.exception';
import {
    GetUserByFieldHandler,
    GetUserByFieldQuery,
} from '@api/modules/user/application/queries/get-user-by-field.handler';
import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginResponse } from '@repo/shared';
import { AuthTokenService } from '../../domain/services/auth-token.service';
import { LoginCommand, LoginHandler } from './login.handler';

export class RefreshTokenCommand extends Command<{ refreshToken: string }> {}

@Injectable()
export class RefreshTokenHandler {
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly getUserByFieldHandler: GetUserByFieldHandler,
        private readonly loginHandler: LoginHandler,
    ) {}

    async execute({ data }: RefreshTokenCommand): Promise<LoginResponse> {
        const { refreshToken } = data;

        const payload = await this.authTokenService.verifyRefreshToken(refreshToken);

        const user = await this.getUserByFieldHandler.execute(
            new GetUserByFieldQuery('id', payload.id),
        );

        if (!user || user.refreshToken !== refreshToken) {
            throw new BusinessException({
                code: 'auth.invalidRefreshToken',
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        return await this.loginHandler.execute(new LoginCommand({ user }));
    }
}
