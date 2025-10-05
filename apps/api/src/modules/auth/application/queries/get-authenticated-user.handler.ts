import { BusinessException } from '@api/common/exceptions/business.exception';
import { SocialProvider } from '@api/common/exceptions/social-provider.exception';
import { User } from '@api/modules/user/domain/entities/user.entity';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@api/modules/user/domain/repositories/i-user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { AuthPasswordService } from '../../domain/services/auth-password.service';

export class GetAuthenticatedUserQuery {
    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}
}

@Injectable()
export class GetAuthenticatedUserHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly authPasswordService: AuthPasswordService,
    ) {}

    async execute({ email, password }: GetAuthenticatedUserQuery): Promise<User> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new BusinessException({ code: 'auth.invalidCredentials' });
        }

        if (!user.isLocalProvider()) {
            throw new SocialProvider();
        }

        if (!user.password) {
            throw new BusinessException({ code: 'auth.invalidCredentials' });
        }

        const isMatch = await this.authPasswordService.verifyPassword(user.password, password);

        if (!isMatch) {
            throw new BusinessException({ code: 'auth.invalidCredentials' });
        }

        return user;
    }
}
