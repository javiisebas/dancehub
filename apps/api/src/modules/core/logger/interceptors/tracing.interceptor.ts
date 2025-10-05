import { BusinessException } from '@api/common/exceptions/business.exception';
import { getRequest } from '@api/common/utils/get-request.util';
import {
    CallHandler,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LogService } from '../services/logger.service';

interface RequestWithMeta extends Request {
    id?: string;
}

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LogService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = getRequest<RequestWithMeta>(context);
        const { method, url, headers } = request;

        const requestId = request.id || this.generateRequestId();
        request.id = requestId;

        const controller = context.getClass().name;
        const handler = context.getHandler().name;
        const route = url.split('?')[0];
        const userAgent = headers['user-agent'] || '';
        const startTime = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const processingTime = Date.now() - startTime;

                this.logger.log(
                    `${method} ${route} - ${processingTime}ms - Success`,
                    'RequestLoggingInterceptor',
                    {
                        controller,
                        handler,
                        processingTime,
                        requestId,
                        route,
                        userAgent,
                        responseSize: this.getResponseSize(data),
                    },
                );
            }),
            catchError((error) => {
                const processingTime = Date.now() - startTime;
                const statusCode = this.getErrorStatusCode(error);

                if (error instanceof BusinessException) {
                    this.logger.warn(
                        `${method} ${route} - ${processingTime}ms - Business Error: ${error.message}`,
                        'RequestLoggingInterceptor',
                        {
                            controller,
                            handler,
                            processingTime,
                            requestId,
                            route,
                            statusCode,
                            errorName: error.constructor.name,
                            errorMessage: error.message,
                            errorCode: error.data?.code,
                            errorArgs: error.data?.args,
                        },
                    );
                } else {
                    this.logger.error(
                        `${method} ${route} - ${processingTime}ms - Error: ${error.message}`,
                        error.stack,
                        'RequestLoggingInterceptor',
                        {
                            controller,
                            handler,
                            processingTime,
                            requestId,
                            route,
                            statusCode,
                            errorName: error.constructor.name,
                            errorMessage: error.message,
                        },
                    );
                }

                throw error;
            }),
        );
    }

    /**
     * Gets the appropriate status code from an error
     */
    private getErrorStatusCode(error: any): number {
        if (error instanceof HttpException) {
            return error.getStatus();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    /**
     * Estimates the size of the response data
     */
    private getResponseSize(data: any): number {
        if (!data) return 0;
        if (typeof data === 'string') return data.length;
        try {
            return JSON.stringify(data).length;
        } catch {
            return 0;
        }
    }

    /**
     * Generates a unique request ID if one is not provided
     */
    private generateRequestId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }
}
