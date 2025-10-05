import { Injectable, OnModuleInit } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { TypedConfigService } from '../../config/config.service';

@Injectable()
export class ObservabilityService implements OnModuleInit {
    private serviceName: string = 'api';
    private environment: string = 'development';

    constructor(private readonly configService: TypedConfigService) {}

    onModuleInit() {
        this.environment = this.configService.get('app.nodeEnv', 'development');
    }

    createLogger(context: string) {
        const logFormat = format.combine(
            format.timestamp(),
            format.printf(({ timestamp, level, message, ...meta }) => {
                return `[${timestamp}] [${level.toUpperCase()}] [${context}]: ${message} ${
                    Object.keys(meta).length ? JSON.stringify(meta) : ''
                }`;
            }),
        );

        const logTransports = [new transports.Console({ format: logFormat })];

        return createLogger({
            level: 'info',
            format: logFormat,
            defaultMeta: {
                service: this.serviceName,
                context,
                env: this.environment,
            },
            transports: logTransports,
        });
    }
}
