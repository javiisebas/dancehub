import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import {
    UpdateUserCommand,
    UpdateUserHandler,
} from '@api/modules/user/application/commands/update-user.handler';
import {
    GetUserHandler,
    GetUserQuery,
} from '@api/modules/user/application/queries/get-user.handler';
import { Injectable } from '@nestjs/common';
import { PasswordResponse } from '@repo/shared';

export class LogoutCommand {
    constructor(public readonly userId: string) {}
}

@Injectable()
export class LogoutHandler {
    constructor(
        private readonly getUserHandler: GetUserHandler,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ userId }: LogoutCommand): Promise<PasswordResponse> {
        const user = await this.getUserHandler.execute(new GetUserQuery(userId));

        if (!user) {
            throw new NotFoundException('User');
        }

        await this.updateUserHandler.execute(
            new UpdateUserCommand(user.id, { refreshToken: null }),
        );

        return {
            success: true,
            message: await this.translationService.t('messages.auth.logoutSuccess'),
        };
    }
}
