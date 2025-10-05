import { AUTH } from '@api/common/constants/auth.constants';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
    ValidateUserExistsHandler,
    ValidateUserExistsQuery,
} from '../../application/queries/validate-user-exists.handler';

export interface JwtRefreshPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, AUTH.JWT_REFRESH) {
    constructor(
        private readonly configService: TypedConfigService,
        private readonly validateUserExistsHandler: ValidateUserExistsHandler,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            secretOrKey: configService.get('auth.jwtRefreshSecret'),
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: JwtRefreshPayload) {
        const refreshToken = req.body.refreshToken;

        const user = await this.validateUserExistsHandler.execute(
            new ValidateUserExistsQuery(payload.id),
        );

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return user;
    }
}