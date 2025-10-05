import { Injectable } from '@nestjs/common';
import { EmailOptions } from '../../infrastructure/dtos/email-options.dto';
import { SendEmailDto } from '../../infrastructure/dtos/send-email.dto';
import { EmailProviderService } from './email-provider.service';
import { EmailTemplateRendererService } from './email-template-renderer.service';

@Injectable()
export class EmailService {
    constructor(
        private readonly emailProvider: EmailProviderService,
        private readonly emailTemplateRenderer: EmailTemplateRendererService,
    ) {}

    async sendEmail(options: SendEmailDto): Promise<any> {
        try {
            const renderedHtml = await this.emailTemplateRenderer.render(
                options.template,
                options.data,
            );
            const emailOptions: EmailOptions = {
                to: options.to,
                subject: options.subject,
                html: renderedHtml,
            };

            return this.emailProvider.sendMail(emailOptions);
        } catch (error) {
            throw error;
        }
    }
}
