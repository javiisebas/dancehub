import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CacheDomain } from '@api/modules/core/cache/constants';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import { EmailQueueService } from '@api/modules/core/mailer/application/services/email-queue.service';
import { EmailTemplateEnum } from '@api/modules/core/mailer/domain/enums/email-templates.enum';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@api/modules/user/domain/repositories/i-user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PasswordResponse } from '@repo/shared';
import { AuthTokenService } from '../../domain/services/auth-token.service';

export class ResetPasswordCommand {
    constructor(public readonly email: string) {}
}

@Injectable()
export class ResetPasswordHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly authTokenService: AuthTokenService,
        private readonly cacheService: CacheService,
        private readonly configService: TypedConfigService,
        private readonly emailQueue: EmailQueueService,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ email }: ResetPasswordCommand): Promise<PasswordResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (user && user.isLocalProvider()) {
            const token = await this.authTokenService.generateToken();

            const cacheKey = new BaseCacheKey(CacheDomain.AUTH, 'reset-password', token);
            await this.cacheService.set(cacheKey, user.id);

            await this.emailQueue.sendEmail({
                template: EmailTemplateEnum.RESET_PASSWORD,
                data: {
                    username: user.firstName ?? user.name,
                    resetUrl: `${this.configService.get('app.frontendOrigin')}/reset-password?token=${token}`,
                },
                subject: await this.translationService.t('mailing.passwordReset.subject'),
                to: user.email,
            });
        }

        return {
            success: true,
            message: await this.translationService.t('messages.auth.resetPasswordSent'),
        };
    }
}
