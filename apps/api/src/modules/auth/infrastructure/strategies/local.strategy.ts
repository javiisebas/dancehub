import { AUTH } from '@api/common/constants/auth.constants';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
    GetAuthenticatedUserHandler,
    GetAuthenticatedUserQuery,
} from '../../application/queries/get-authenticated-user.handler';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, AUTH.LOCAL) {
    constructor(private readonly getAuthenticatedUserHandler: GetAuthenticatedUserHandler) {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string): Promise<User> {
        return await this.getAuthenticatedUserHandler.execute(
            new GetAuthenticatedUserQuery(email, password),
        );
    }
}
