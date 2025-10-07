import { Command } from '@api/common/abstract/application/commands.abstract';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import {
    UpdateUserCommand,
    UpdateUserHandler,
} from '@api/modules/user/application/commands/update-user.handler';
import {
    GetUserByFieldHandler,
    GetUserByFieldQuery,
} from '@api/modules/user/application/queries/get-user-by-field.handler';
import { Injectable } from '@nestjs/common';
import { PasswordResponse } from '@repo/shared';

export class LogoutCommand extends Command<{ userId: string }> {}

@Injectable()
export class LogoutHandler {
    constructor(
        private readonly getUserByFieldHandler: GetUserByFieldHandler,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ data }: LogoutCommand): Promise<PasswordResponse> {
        const { userId } = data;

        const user = await this.getUserByFieldHandler.execute(
            new GetUserByFieldQuery('id', userId),
        );

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
