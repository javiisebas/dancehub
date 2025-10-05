import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FALLBACK_LANGUAGE } from '@repo/shared';
import { I18nContext } from 'nestjs-i18n';

export const CurrentLocale = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const i18n = I18nContext.current(ctx);
        return i18n?.lang || FALLBACK_LANGUAGE;
    },
);
