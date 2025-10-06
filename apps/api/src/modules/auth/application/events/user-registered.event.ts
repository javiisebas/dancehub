import { TypedConfigService } from '@api/modules/core/config/config.service';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import { EmailQueueService } from '@api/modules/core/mailer/application/services/email-queue.service';
import { EmailTemplateEnum } from '@api/modules/core/mailer/domain/enums/email-templates.enum';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export class UserRegisteredEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly name: string,
        public readonly verificationToken: string,
    ) {}
}

@Injectable()
export class UserRegisteredListener {
    constructor(
        private readonly emailQueue: EmailQueueService,
        private readonly configService: TypedConfigService,
        private readonly translationService: TranslationService,
    ) {}

    @OnEvent('auth.user.registered')
    async handle(event: UserRegisteredEvent): Promise<void> {
        const verificationUrl = `${this.configService.get('app.frontendOrigin')}/verify-email/?token=${event.verificationToken}`;

        await this.emailQueue.sendEmail({
            template: EmailTemplateEnum.VERIFY_EMAIL,
            data: {
                username: event.name,
                verificationUrl,
            },
            subject: await this.translationService.t('mailing.verifyAccount.subject'),
            to: event.email,
        });
    }
}
