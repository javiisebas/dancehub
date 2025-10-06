import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { CacheService } from '../cache.service';
import {
    CACHE_INVALIDATE_KEY,
    CacheInvalidateMetadata,
} from '../decorators/cache-invalidate.decorator';

@Injectable()
export class CacheInvalidateInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly cacheService: CacheService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const metadata = this.reflector.get<CacheInvalidateMetadata>(
            CACHE_INVALIDATE_KEY,
            context.getHandler(),
        );

        if (!metadata) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(async () => {
                const request = context.switchToHttp().getRequest();
                const idParam = metadata.idParam || 'id';
                const id = request.params?.[idParam] || request.body?.[idParam];

                if (id) {
                    await this.cacheService.invalidateEntity(metadata.entity, id, {
                        includeRelations: metadata.includeRelations,
                    });
                }
            }),
        );
    }
}
