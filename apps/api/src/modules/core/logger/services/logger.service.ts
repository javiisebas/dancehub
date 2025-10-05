import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class LogService implements LoggerService {
    private loggers: Map<string, Logger> = new Map();

    private getOrCreateLogger(context: string): Logger {
        if (!this.loggers.has(context)) {
            this.loggers.set(context, new Logger(context));
        }
        return this.loggers.get(context)!;
    }

    log(message: string, context?: string, meta?: Record<string, any>): void {
        const logger = this.getOrCreateLogger(context || 'Application');
        logger.log(message);
    }

    error(message: string, trace?: string, context?: string, meta?: Record<string, any>): void {
        const logger = this.getOrCreateLogger(context || 'Application');
        logger.error(message, trace);
    }

    warn(message: string, context?: string, meta?: Record<string, any>): void {
        const logger = this.getOrCreateLogger(context || 'Application');
        logger.warn(message);
    }

    debug(message: string, context?: string, meta?: Record<string, any>): void {
        const logger = this.getOrCreateLogger(context || 'Application');
        logger.debug(message);
    }

    verbose(message: string, context?: string, meta?: Record<string, any>): void {
        const logger = this.getOrCreateLogger(context || 'Application');
        logger.verbose(message);
    }
}
