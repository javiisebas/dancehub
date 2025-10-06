import { Command } from '@api/common/abstract/application/commands.abstract';
import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CacheDomain } from '@api/modules/core/cache/constants';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '@api/modules/user/domain/repositories/i-user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordResponse } from '@repo/shared';
import { AuthTokenService } from '../../domain/services/auth-token.service';
import { PasswordResetRequestedEvent } from '../events/password-reset-requested.event';

export class ResetPasswordCommand extends Command<{ email: string }> {}

@Injectable()
export class ResetPasswordHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly authTokenService: AuthTokenService,
        private readonly cacheService: CacheService,
        private readonly eventEmitter: EventEmitter2,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ data }: ResetPasswordCommand): Promise<PasswordResponse> {
        const { email } = data;

        const user = await this.userRepository.findByEmail(email);

        if (user && user.isLocalProvider()) {
            const token = await this.authTokenService.generateToken();

            const cacheKey = new BaseCacheKey(CacheDomain.AUTH, 'reset-password', token);
            await this.cacheService.set(cacheKey, user.id);

            this.eventEmitter.emit(
                'auth.password-reset.requested',
                new PasswordResetRequestedEvent(
                    user.id,
                    user.email,
                    user.firstName ?? user.name,
                    token,
                ),
            );
        }

        return {
            success: true,
            message: await this.translationService.t('messages.auth.resetPasswordSent'),
        };
    }
}
