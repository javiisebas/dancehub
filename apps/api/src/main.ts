import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';
import { LocaleInterceptor } from './common/interceptors/locale.interceptor';
import { ResolvePromisesInterceptor } from './common/interceptors/serializer.interceptor';
import { setupSwagger } from './common/swagger';
import { validationOptions } from './common/utils/validation-options';
import { TypedConfigService } from './modules/core/config/config.service';
import { TranslationService } from './modules/core/i18n/services/translation.service';
import { LogService } from './modules/core/logger/services/logger.service';
import { MainLogger } from './modules/core/logger/services/main-logger.service';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, {
        logger: new MainLogger(),
    });

    const configService = app.get(TypedConfigService);
    const logger = app.get(LogService);

    const origin = configService.get('app.frontendOrigin');
    app.enableCors({
        origin,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    app.use((req, res, next) => {
        if (!req.id) {
            req.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
        }
        next();
    });

    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

    app.setGlobalPrefix('api', { exclude: [] });

    if (!configService.get('app.isProduction')) setupSwagger(app);

    app.useGlobalPipes(new ValidationPipe(validationOptions));

    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(
        new LocaleInterceptor(reflector),
        new ResolvePromisesInterceptor(),
        new ClassSerializerInterceptor(reflector),
    );

    const translationService = app.get(TranslationService);
    app.useGlobalFilters(new GlobalExceptionFilter(logger, configService, translationService));

    const port = configService.get('app.port', 4000);
    await app.listen(port, () => logger.log(`Application running on port ${port}`, 'Bootstrap'));
};
bootstrap();
