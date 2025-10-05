import { BusinessException } from '@api/common/exceptions/business.exception';
import { User } from '@api/modules/user/domain/entities/user.entity';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@api/modules/user/domain/repositories/i-user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { LoginResponse, SocialLoginRequest, UserStatusEnum } from '@repo/shared';
import { randomUUID } from 'crypto';
import { LoginCommand, LoginHandler } from './login.handler';

export class SocialLoginCommand {
    constructor(public readonly data: SocialLoginRequest) {}
}

@Injectable()
export class SocialLoginHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly loginHandler: LoginHandler,
    ) {}

    async execute({ data }: SocialLoginCommand): Promise<LoginResponse> {
        if (!data.email) {
            throw new BusinessException({ code: 'auth.emailRequired' });
        }

        let user = await this.userRepository.findByEmail(data.email);

        if (!user) {
            user = User.create(
                randomUUID(),
                data.email,
                data.displayName ?? `${data.firstName} ${data.lastName}`.trim(),
                undefined,
                data.provider,
                data.providerId,
                data.firstName,
                data.lastName,
                data.displayName,
                data.image,
                data.verified ? UserStatusEnum.VERIFIED : UserStatusEnum.PENDING,
            );

            user = await this.userRepository.save(user);
        } else {
            if (user.provider !== data.provider) {
                throw new BusinessException({ code: 'auth.userAlreadyDifferentProvider' });
            }

            if (data.verified && user.isPending()) {
                user.markAsVerified();
                await this.userRepository.updateEntity(user);
            }
        }

        return await this.loginHandler.execute(new LoginCommand(user));
    }
}
