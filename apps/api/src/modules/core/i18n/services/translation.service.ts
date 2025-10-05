import { TranslationKey } from '@api/common/interfaces/i18n/i-translation-key.interface';
import { TranslationOptions } from '@api/common/interfaces/i18n/i-translation-option.interface';
import { Injectable } from '@nestjs/common';
import { FALLBACK_LANGUAGE } from '@repo/shared';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TranslationService {
    constructor() {}

    async t(key: TranslationKey, options?: TranslationOptions): Promise<string> {
        const i18n = I18nContext.current();

        if (i18n) {
            return i18n.t(key, {
                args: options?.args,
                defaultValue: options?.defaultValue,
                lang: options?.lang ?? I18nContext?.current()?.lang,
            });
        }

        return key;
    }

    get lang(): string | undefined {
        return I18nContext.current()?.lang;
    }

    get fallbackLanguage(): string {
        return FALLBACK_LANGUAGE;
    }

    get isFallbackLanguage(): boolean {
        return this.lang === this.fallbackLanguage;
    }
}
