import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CacheDomain } from '@api/modules/core/cache/constants';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import { EmailQueueService } from '@api/modules/core/mailer/application/services/email-queue.service';
import { EmailTemplateEnum } from '@api/modules/core/mailer/domain/enums/email-templates.enum';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PasswordResponse } from '@repo/shared';
import { AuthTokenService } from '../../domain/services/auth-token.service';

export class ResendVerificationCommand {
    constructor(public readonly user: User) {}
}

@Injectable()
export class ResendVerificationHandler {
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly cacheService: CacheService,
        private readonly configService: TypedConfigService,
        private readonly emailQueue: EmailQueueService,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ user }: ResendVerificationCommand): Promise<PasswordResponse> {
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

        return {
            success: true,
            message: await this.translationService.t('messages.auth.emailVerificationSent'),
        };
    }
}
