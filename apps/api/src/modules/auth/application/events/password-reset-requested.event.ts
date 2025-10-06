import { TypedConfigService } from '@api/modules/core/config/config.service';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import { EmailQueueService } from '@api/modules/core/mailer/application/services/email-queue.service';
import { EmailTemplateEnum } from '@api/modules/core/mailer/domain/enums/email-templates.enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export class PasswordResetRequestedEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly name: string,
        public readonly token: string,
    ) {}
}

@Injectable()
export class PasswordResetRequestedListener {
    constructor(
        private readonly emailQueue: EmailQueueService,
        private readonly configService: TypedConfigService,
        private readonly translationService: TranslationService,
    ) {}

    @OnEvent('auth.password-reset.requested')
    async handle(event: PasswordResetRequestedEvent): Promise<void> {
        const resetUrl = `${this.configService.get('app.frontendOrigin')}/reset-password?token=${event.token}`;

        await this.emailQueue.sendEmail({
            template: EmailTemplateEnum.RESET_PASSWORD,
            data: {
                username: event.name,
                resetUrl,
            },
            subject: await this.translationService.t('mailing.passwordReset.subject'),
            to: event.email,
        });
    }
}
