import { Global, Module } from '@nestjs/common';
import { FALLBACK_LANGUAGE } from '@repo/shared';
import {
    AcceptLanguageResolver,
    CookieResolver,
    HeaderResolver,
    I18nJsonLoader,
    I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';
import { TranslationService } from './services/translation.service';

@Global()
@Module({
    imports: [
        I18nModule.forRootAsync({
            useFactory: () => ({
                fallbackLanguage: FALLBACK_LANGUAGE,
                loader: I18nJsonLoader,
                loaderOptions: {
                    path: path.join(__dirname, './translations/'),
                    watch: true,
                },
            }),
            resolvers: [
                new CookieResolver(['NEXT_LOCALE']),
                new HeaderResolver(['x-locale']),
                AcceptLanguageResolver,
            ],
        }),
    ],
    providers: [TranslationService],
    exports: [TranslationService],
})
export class AppI18nModule {}
