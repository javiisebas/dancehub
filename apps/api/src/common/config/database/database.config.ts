import { registerAs } from '@nestjs/config';

import { validateConfig } from '@api/common/utils/validate-config';
import {
    IsBooleanString,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
    ValidateIf,
} from 'class-validator';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
    @ValidateIf((envValues) => envValues.DATABASE_URL)
    @IsString()
    DATABASE_URL: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_HOST: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsInt()
    @Min(0)
    @Max(65535)
    DATABASE_PORT: number;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_PASSWORD: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_NAME: string;

    @ValidateIf((envValues) => !envValues.DATABASE_URL)
    @IsString()
    DATABASE_USERNAME: string;

    @IsInt()
    @IsOptional()
    DATABASE_MAX_CONNECTIONS: number;

    @IsString()
    @IsOptional()
    DATABASE_KEY: string;

    @IsBooleanString()
    @IsOptional()
    DATABASE_SSL: string;

    @IsBooleanString()
    @IsOptional()
    DATABASE_LOGGING: string;

    @IsInt()
    @IsOptional()
    DATABASE_POOL_SIZE: number;

    @IsInt()
    @IsOptional()
    DATABASE_POOL_MIN: number;

    @IsInt()
    @IsOptional()
    DATABASE_IDLE_TIMEOUT: number;

    @IsInt()
    @IsOptional()
    @IsInt()
    @IsOptional()
    DATABASE_RETRY_ATTEMPTS: number;

    @IsInt()
    @IsOptional()
    DATABASE_RETRY_DELAY: number;

    @IsInt()
    @IsOptional()
    DATABASE_CONNECTION_TIMEOUT: number;
}

export default registerAs<DatabaseConfig>('database', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        host: process.env.DATABASE_HOST,
        key: process.env.DATABASE_KEY,
        maxConnections: Number(process.env.DATABASE_MAX_CONNECTIONS) || 100,
        name: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT) || 5432,
        type: process.env.DATABASE_TYPE,
        url: process.env.DATABASE_URL,
        username: process.env.DATABASE_USERNAME,
        ssl: process.env.DATABASE_SSL ? process.env.DATABASE_SSL === 'true' : false,
        logging: process.env.DATABASE_LOGGING ? process.env.DATABASE_LOGGING === 'true' : false,
        poolMin: Number(process.env.DATABASE_POOL_MIN) || 2,
        poolSize: Number(process.env.DATABASE_POOL_SIZE) || 20,
        retryAttempts: Number(process.env.DATABASE_RETRY_ATTEMPTS) || 0,
        connectionTimeout: Number(process.env.DATABASE_CONNECTION_TIMEOUT) || 5000,
        idleTimeout: Number(process.env.DATABASE_IDLE_TIMEOUT) || 30000,
    };
});
