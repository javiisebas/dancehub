import { validateConfig } from '@api/common/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { OAuthConfig } from './oauth-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    OAUTH_GOOGLE_ID: string;

    @IsString()
    OAUTH_GOOGLE_SECRET: string;

    @IsString()
    OAUTH_GOOGLE_REDIRECT_URL: string;
}

export default registerAs<OAuthConfig>('oauth', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        googleClientId: process.env.OAUTH_GOOGLE_ID || '',
        googleClientSecret: process.env.OAUTH_GOOGLE_SECRET || '',
        googleRedirectUrl: process.env.OAUTH_GOOGLE_REDIRECT_URL || '',
    };
});
