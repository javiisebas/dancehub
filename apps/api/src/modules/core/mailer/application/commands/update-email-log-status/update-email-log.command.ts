import { EmailStatusEnum } from '../../../domain/enums/email-status.enum';

export interface UpdateEmailLogCommandInput {
    id: string;
    status: EmailStatusEnum;
    error?: string;
    newAttempts?: boolean;
}

export class UpdateEmailLogCommand {
    constructor(public readonly data: UpdateEmailLogCommandInput) {}
}
