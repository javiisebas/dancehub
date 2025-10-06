import { Command } from '@api/common/abstract/application/commands.abstract';
import { BusinessException } from '@api/common/exceptions/business.exception';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CacheDomain } from '@api/modules/core/cache/constants';
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
import { AuthPasswordService } from '../../domain/services/auth-password.service';

export class SetNewPasswordCommand extends Command<{
    token: string;
    newPassword: string;
    confirmPassword: string;
}> {}

@Injectable()
export class SetNewPasswordHandler {
    constructor(
        private readonly authPasswordService: AuthPasswordService,
        private readonly cacheService: CacheService,
        private readonly getUserHandler: GetUserHandler,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ data }: SetNewPasswordCommand): Promise<PasswordResponse> {
        const { token, newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword) {
            throw new BusinessException({ code: 'auth.passwordMismatch' });
        }

        const cacheKey = new BaseCacheKey(CacheDomain.AUTH, 'reset-password', token);
        const userId = (await this.cacheService.get(cacheKey)) as string;

        if (!userId) {
            throw new BusinessException({ code: 'auth.passwordTokenExpired' });
        }

        const user = await this.getUserHandler.execute(new GetUserQuery(userId));

        if (!user) {
            throw new NotFoundException('User');
        }

        const hashedPassword = await this.authPasswordService.hashPassword(newPassword);

        await this.updateUserHandler.execute(
            new UpdateUserCommand(user.id, { password: hashedPassword }),
        );

        const deleteKey = new BaseCacheKey(CacheDomain.AUTH, 'reset-password', token);
        await this.cacheService.del(deleteKey);

        return {
            success: true,
            message: await this.translationService.t('messages.auth.passwordChanged'),
        };
    }
}
