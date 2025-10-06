import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheService } from './cache.service';
import { CacheInvalidateInterceptor } from './interceptors/cache-invalidate.interceptor';
import { RelationshipManager } from './relationship-manager';
import { TranslatableCacheService } from './translatable-cache.service';

@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const host = configService.get<string>('cache.host', 'localhost');
                const port = configService.get<number>('cache.port', 6379);
                const password = configService.get<string>('cache.password');
                const db = configService.get<number>('cache.db', 0);
                const ttl = configService.get<number>('cache.ttl', 300);

                return {
                    store: await redisStore({
                        socket: { host, port },
                        password,
                        database: db,
                        ttl: ttl * 1000,
                    }),
                };
            },
        }),
    ],
    providers: [
        CacheService,
        TranslatableCacheService,
        RelationshipManager,
        CacheInvalidateInterceptor,
    ],
    exports: [
        CacheService,
        TranslatableCacheService,
        RelationshipManager,
        CacheInvalidateInterceptor,
    ],
})
export class CacheModule {}
