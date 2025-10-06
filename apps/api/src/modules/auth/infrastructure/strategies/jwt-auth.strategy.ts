import { AUTH } from '@api/common/constants/auth.constants';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
    ValidateUserExistsHandler,
    ValidateUserExistsQuery,
} from '../../application/queries/validate-user-exists.handler';

export interface JwtPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AUTH.JWT) {
    constructor(
        private readonly configService: TypedConfigService,
        private readonly validateUserExistsHandler: ValidateUserExistsHandler,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('auth.jwtSecret'),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        return await this.validateUserExistsHandler.execute(
            new ValidateUserExistsQuery(payload.id),
        );
    }
}
