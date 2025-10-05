import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { UNIT_OF_WORK_KEY } from './unit-of-work.constants';
import { UnitOfWorkService } from './unit-of-work.service';

@Injectable()
export class UnitOfWorkInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly databaseService: DatabaseService,
        private readonly unitOfWorkService: UnitOfWorkService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const handler = context.getHandler();
        const isUnitOfWork = this.reflector.get<boolean>(UNIT_OF_WORK_KEY, handler);

        if (!isUnitOfWork) {
            return next.handle();
        }

        return from(
            this.unitOfWorkService.runInTransaction(this.databaseService.db, async () => {
                return new Promise((resolve, reject) => {
                    next.handle().subscribe({
                        next: (value) => resolve(value),
                        error: (error) => reject(error),
                    });
                });
            }),
        );
    }
}
