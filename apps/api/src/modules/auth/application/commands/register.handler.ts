import { BusinessException } from '@api/common/exceptions/business.exception';
import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CacheDomain } from '@api/modules/core/cache/constants';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import { EmailQueueService } from '@api/modules/core/mailer/application/services/email-queue.service';
import { EmailTemplateEnum } from '@api/modules/core/mailer/domain/enums/email-templates.enum';
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
import { CreateUserRequest, LoginResponse } from '@repo/shared';
import { AuthPasswordService } from '../../domain/services/auth-password.service';
import { AuthTokenService } from '../../domain/services/auth-token.service';

export class RegisterCommand {
    constructor(public readonly data: CreateUserRequest) {}
}

@Injectable()
export class RegisterHandler {
    constructor(
        private readonly authPasswordService: AuthPasswordService,
        private readonly authTokenService: AuthTokenService,
        private readonly createUserHandler: CreateUserHandler,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly emailQueue: EmailQueueService,
        private readonly cacheService: CacheService,
        private readonly configService: TypedConfigService,
        private readonly translationService: TranslationService,
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

        await this.emailQueue.sendEmail({
            template: EmailTemplateEnum.VERIFY_EMAIL,
            data: {
                username: user.firstName ?? user.name,
                verificationUrl: `${this.configService.get('app.frontendOrigin')}/verify-email/?token=${token}`,
            },
            subject: await this.translationService.t('mailing.verifyAccount.subject'),
            to: user.email,
        });
    }
}
