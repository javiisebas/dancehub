import { TypedConfigService } from '@api/modules/core/config/config.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailOptions } from '../../infrastructure/dtos/email-options.dto';

@Injectable()
export class EmailProviderService {
    private readonly transporter: nodemailer.Transporter;
    private readonly from: string;

    constructor(private readonly config: TypedConfigService) {
        const gmailUser = this.config.get('app.gmailUser');
        const gmailPass = this.config.get('app.gmailPass');
        const isProduction = this.config.get('app.isProduction');

        if (isProduction && (!gmailUser || !gmailPass)) {
            throw new Error(
                'Gmail credentials (gmailUser and gmailPass) must be provided in production.',
            );
        }

        this.from = gmailUser || 'noreply@dancehub.com';

        if (gmailUser && gmailPass) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: gmailUser,
                    pass: gmailPass,
                },
            });
        } else {
            this.transporter = nodemailer.createTransport({
                host: 'localhost',
                port: 1025,
                ignoreTLS: true,
            });
        }
    }

    async sendMail(options: EmailOptions): Promise<any> {
        if (!options.html) {
            throw new Error('At least HTML content must be provided.');
        }

        const mailOptions = {
            from: this.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);

            return info;
        } catch (error: any) {
            throw new InternalServerErrorException('Failed to send email.');
        }
    }
}
