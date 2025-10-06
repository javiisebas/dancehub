import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
    constructor(private dto: ClassConstructor<T>) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
        return next.handle().pipe(
            map((data: unknown) => {
                return plainToInstance(this.dto, data, {
                    enableImplicitConversion: true,
                });
            }),
        );
    }
}
