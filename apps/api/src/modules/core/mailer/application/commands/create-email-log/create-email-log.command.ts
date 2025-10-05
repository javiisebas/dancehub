import { EmailTemplateEnum } from '../../../domain/enums/email-templates.enum';

export interface CreateEmailLogCommandInput {
    to: string;
    subject: string;
    template: EmailTemplateEnum;
    data: any;
}

export class CreateEmailLogCommand {
    constructor(public readonly data: CreateEmailLogCommandInput) {}
}
