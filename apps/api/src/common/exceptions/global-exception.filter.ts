import { TypedConfigService } from '@api/modules/core/config/config.service';
import { TranslationService } from '@api/modules/core/i18n/services/translation.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FALLBACK_LANGUAGE } from '@repo/shared';
import { Request, Response } from 'express';
import { inspect } from 'util';
import { TranslationKey } from '../interfaces/i18n/i-translation-key.interface';
import { BusinessException } from './business.exception';

interface RequestWithMeta extends Request {
    id?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly logService: LogService,
        private readonly configService: TypedConfigService,
        private readonly translationService: TranslationService,
    ) {}

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<RequestWithMeta>();
        const response = ctx.getResponse<Response>();

        const requestId = request.id || '';

        let status: number =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        let errorResponse: any = {};

        if (exception instanceof BusinessException) {
            const fullCode = `errors.${exception.data.code}` as TranslationKey;

            let translatedMessage = await this.translationService.t(fullCode, {
                args: exception.data.args,
                defaultValue: fullCode,
            });

            if (translatedMessage === fullCode && !this.translationService.isFallbackLanguage) {
                translatedMessage = await this.translationService.t(fullCode, {
                    lang: FALLBACK_LANGUAGE,
                    args: exception.data.args,
                    defaultValue: fullCode,
                });
            }

            errorResponse = {
                statusCode: status,
                message: translatedMessage,
                errorCode: fullCode,
                path: request.url,
                timestamp: new Date().toISOString(),
                requestId,
            };
        } else if (exception instanceof HttpException) {
            const errorMessage = this.getErrorMessage(exception);

            errorResponse = {
                statusCode: status,
                message: errorMessage,
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId,
            };
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            const errorId = this.generateErrorId();

            errorResponse = {
                statusCode: status,
                message: 'Internal server error',
                timestamp: new Date().toISOString(),
                path: request.url,
                requestId,
                errorId,
            };

            this.logService.error(
                `Unhandled exception: ${exception?.message || 'Unknown error'}`,
                exception?.stack || 'No stack trace',
                'GlobalExceptionFilter',
                {
                    errorId,
                    requestId,
                    url: request.url,
                    method: request.method,
                },
            );
        }

        const isDev = !this.configService.get('app.isProduction');
        if (isDev && exception) {
            Object.assign(errorResponse, this.getDevErrorDetails(exception));
            this.logService.error(
                'Exception Details (Development mode):',
                inspect(exception, { depth: 5, colors: true }),
                'GlobalExceptionFilter',
                {
                    requestId,
                },
            );
        }

        response.status(status).json(errorResponse);
    }

    private getErrorMessage(exception: HttpException): string | object {
        const resp = exception.getResponse();
        return typeof resp === 'string' ? resp : resp['message'] || resp;
    }

    private getDevErrorDetails(exception: any): Record<string, any> {
        const stack = exception.stack || '';
        const fileLineRegex = /\((.*):(\d+):(\d+)\)/;
        const [_, file, line] = stack.match(fileLineRegex) || [];
        return {
            ...(file && { file: file.replace(process.cwd(), '') }),
            ...(line && { line }),
            errorType: exception.constructor.name,
        };
    }

    /**
     * Generates a unique error ID to help with troubleshooting
     */
    private generateErrorId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    }
}
