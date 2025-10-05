import { BusinessException } from '@api/common/exceptions/business.exception';
import { GetUserHandler, GetUserQuery } from '@api/modules/user/application/queries/get-user.handler';
import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginResponse } from '@repo/shared';
import { AuthTokenService } from '../../domain/services/auth-token.service';
import { LoginCommand, LoginHandler } from './login.handler';

export class RefreshTokenCommand {
    constructor(public readonly refreshToken: string) {}
}

@Injectable()
export class RefreshTokenHandler {
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly getUserHandler: GetUserHandler,
        private readonly loginHandler: LoginHandler,
    ) {}

    async execute({ refreshToken }: RefreshTokenCommand): Promise<LoginResponse> {
        const payload = await this.authTokenService.verifyRefreshToken(refreshToken);

        const user = await this.getUserHandler.execute(new GetUserQuery(payload.id));

        if (!user || user.refreshToken !== refreshToken) {
            throw new BusinessException({
                code: 'auth.invalidRefreshToken',
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        return await this.loginHandler.execute(new LoginCommand(user));
    }
}
