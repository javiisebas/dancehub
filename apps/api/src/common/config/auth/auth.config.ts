import { validateConfig } from '@api/common/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    JWT_ACCESS_SECRET_KEY: string;

    @IsString()
    JWT_ACCESS_EXPIRATION_TIME: string;

    @IsString()
    JWT_REFRESH_SECRET_KEY: string;

    @IsString()
    JWT_REFRESH_EXPIRATION_TIME: string;

    @IsString()
    QR_SECRET_KEY: string;
}

export default registerAs<AuthConfig>('auth', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        jwtSecret: process.env.JWT_ACCESS_SECRET_KEY || '',
        jwtExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME || '',
        jwtRefreshSecret: process.env.JWT_REFRESH_SECRET_KEY || '',
        jwtRefreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '',
        qrSecretKey: process.env.QR_SECRET_KEY || null,
    };
});
