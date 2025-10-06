import { Command } from '@api/common/abstract/application/commands.abstract';
import { BusinessException } from '@api/common/exceptions/business.exception';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import {
    UpdateUserCommand,
    UpdateUserHandler,
} from '@api/modules/user/application/commands/update-user.handler';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PasswordResponse } from '@repo/shared';
import { AuthPasswordService } from '../../domain/services/auth-password.service';

export class ChangePasswordCommand extends Command<{
    user: User;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}> {}

@Injectable()
export class ChangePasswordHandler {
    constructor(
        private readonly authPasswordService: AuthPasswordService,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ data }: ChangePasswordCommand): Promise<PasswordResponse> {
        const { user, oldPassword, newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword)
            throw new BusinessException({ code: 'auth.passwordMismatch' });

        if (!user.isLocalProvider())
            throw new BusinessException({ code: 'auth.passwordSocialReset' });

        if (newPassword === oldPassword)
            throw new BusinessException({ code: 'auth.passwordOldAndNewMatch' });

        if (!user.password) throw new BusinessException({ code: 'auth.invalidCredentials' });

        const isValidOldPassword = await this.authPasswordService.verifyPassword(
            user.password,
            oldPassword,
        );

        if (!isValidOldPassword) throw new BusinessException({ code: 'auth.invalidCredentials' });

        const hashedPassword = await this.authPasswordService.hashPassword(newPassword);

        await this.updateUserHandler.execute(
            new UpdateUserCommand(user.id, { password: hashedPassword }),
        );

        return {
            success: true,
            message: await this.translationService.t('messages.auth.passwordChanged'),
        };
    }
}
