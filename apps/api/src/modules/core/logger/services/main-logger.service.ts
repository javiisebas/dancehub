import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class MainLogger extends ConsoleLogger {
    log(message: any, context?: string): void {
        if (
            context === 'RouterExplorer' &&
            typeof message === 'string' &&
            message.includes('Mapped {')
        ) {
            return;
        }

        if (context === 'RoutesResolver' && typeof message === 'string') {
            return;
        }

        super.log(message, context);
    }
}
