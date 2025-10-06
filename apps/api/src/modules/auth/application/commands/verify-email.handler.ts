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
import { HttpStatus, Injectable } from '@nestjs/common';
import { PasswordResponse, UserStatusEnum } from '@repo/shared';

export class VerifyEmailCommand extends Command<{ token: string }> {}

@Injectable()
export class VerifyEmailHandler {
    constructor(
        private readonly cacheService: CacheService,
        private readonly getUserHandler: GetUserHandler,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ data }: VerifyEmailCommand): Promise<PasswordResponse> {
        const { token } = data;

        const cacheKey = new BaseCacheKey(CacheDomain.AUTH, 'email-verification', token);
        const userId = (await this.cacheService.get(cacheKey)) as string;

        if (!userId) {
            throw new BusinessException({
                code: 'auth.confirmationTokenExpired',
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        const user = await this.getUserHandler.execute(new GetUserQuery(userId));

        if (!user) {
            throw new NotFoundException('User');
        }

        if (user.isVerified()) {
            return {
                success: true,
                message: await this.translationService.t('messages.auth.accountAlreadyVerified'),
            };
        }

        await this.updateUserHandler.execute(
            new UpdateUserCommand(user.id, { status: UserStatusEnum.VERIFIED }),
        );

        const deleteKey = new BaseCacheKey(CacheDomain.AUTH, 'email-verification', token);
        await this.cacheService.del(deleteKey);

        return {
            success: true,
            message: await this.translationService.t('messages.auth.accountVerified'),
        };
    }
}
