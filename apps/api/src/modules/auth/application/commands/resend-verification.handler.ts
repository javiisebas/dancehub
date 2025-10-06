import { Command } from '@api/common/abstract/application/commands.abstract';
import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CacheDomain } from '@api/modules/core/cache/constants';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordResponse } from '@repo/shared';
import { AuthTokenService } from '../../domain/services/auth-token.service';
import { EmailVerificationRequestedEvent } from '../events/email-verification-requested.event';

export class ResendVerificationCommand extends Command<{ user: User }> {}

@Injectable()
export class ResendVerificationHandler {
    constructor(
        private readonly authTokenService: AuthTokenService,
        private readonly cacheService: CacheService,
        private readonly eventEmitter: EventEmitter2,
        private readonly translationService: TranslationService,
    ) {}

    async execute({ data }: ResendVerificationCommand): Promise<PasswordResponse> {
        const { user } = data;

        const token = await this.authTokenService.generateToken();

        const cacheKey = new BaseCacheKey(CacheDomain.AUTH, 'email-verification', token);
        await this.cacheService.set(cacheKey, user.id);

        this.eventEmitter.emit(
            'auth.email-verification.requested',
            new EmailVerificationRequestedEvent(
                user.id,
                user.email,
                user.firstName ?? user.name,
                token,
            ),
        );

        return {
            success: true,
            message: await this.translationService.t('messages.auth.emailVerificationSent'),
        };
    }
}
