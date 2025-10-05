import { validateConfig } from '@api/common/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CacheConfig } from './cache-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    REDIS_HOST: string;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsOptional()
    REDIS_PORT: number;

    @IsInt()
    @Min(0)
    CACHE_TTL: number;

    @IsString()
    @IsOptional()
    REDIS_PASSWORD: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    REDIS_DB: number;
}

export default registerAs<CacheConfig>('cache', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        ttl: Number(process.env.CACHE_TTL) || 3600,
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DB) || undefined,
        keyPrefix: process.env.CACHE_KEY_PREFIX || 'dancehub:',
    };
});
