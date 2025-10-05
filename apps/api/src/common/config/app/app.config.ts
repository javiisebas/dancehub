import { validateConfig } from '@api/common/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AppConfig } from './app-config.type';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariablesValidator {
    @IsEnum(Environment)
    @IsOptional()
    NODE_ENV: Environment;

    @IsString()
    ORIGIN: string;

    @IsString()
    FRONTEND_ORIGIN: string;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsOptional()
    APP_PORT: number;

    @IsString()
    @IsOptional()
    API_PREFIX: string;

    @IsString()
    @IsOptional()
    APP_HEADER_LANGUAGE: string;

    @IsString()
    @IsOptional()
    RESEND_API_KEY: string;

    @IsString()
    @IsOptional()
    RESEND_FROM: string;

    @IsString()
    @IsOptional()
    GMAIL_USER: string;

    @IsString()
    @IsOptional()
    GMAIL_PASS: string;

    @IsString()
    @IsOptional()
    APP_VERSION: string;
}

export default registerAs<AppConfig>('app', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        nodeEnv: process.env.NODE_ENV || 'development',
        origin: process.env.ORIGIN || 'http://localhost:4000/api',
        frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
        isProduction: process.env.NODE_ENV === 'production',
        workingDirectory: process.env.PWD || process.cwd(),
        port: process.env.APP_PORT
            ? Number(process.env.APP_PORT)
            : process.env.PORT
              ? Number(process.env.PORT)
              : 4000,
        apiPrefix: process.env.API_PREFIX || '/api',
        headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
        resendApiKey: process.env.RESEND_API_KEY || '',
        resendFrom: process.env.RESEND_FROM || '',
        gmailUser: process.env.GMAIL_USER || '',
        gmailPass: process.env.GMAIL_PASS || '',
        version: process.env.APP_VERSION || '0.0.1',
    };
});
