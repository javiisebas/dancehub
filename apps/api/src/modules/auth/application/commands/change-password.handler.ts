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

export class ChangePasswordCommand {
    constructor(
        public readonly user: User,
        public readonly oldPassword: string,
        public readonly newPassword: string,
        public readonly confirmPassword: string,
    ) {}
}

@Injectable()
export class ChangePasswordHandler {
    constructor(
        private readonly authPasswordService: AuthPasswordService,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly translationService: TranslationService,
    ) {}

    async execute({
        user,
        oldPassword,
        newPassword,
        confirmPassword,
    }: ChangePasswordCommand): Promise<PasswordResponse> {
        if (newPassword !== confirmPassword) {
            throw new BusinessException({ code: 'auth.passwordMismatch' });
        }

        if (!user.isLocalProvider()) {
            throw new BusinessException({ code: 'auth.passwordSocialReset' });
        }

        if (newPassword === oldPassword) {
            throw new BusinessException({ code: 'auth.passwordOldAndNewMatch' });
        }

        if (!user.password) {
            throw new BusinessException({ code: 'auth.invalidCredentials' });
        }

        const isValidOldPassword = await this.authPasswordService.verifyPassword(
            user.password,
            oldPassword,
        );

        if (!isValidOldPassword) {
            throw new BusinessException({ code: 'auth.invalidCredentials' });
        }

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
