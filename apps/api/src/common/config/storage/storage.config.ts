import { registerAs } from '@nestjs/config';
import { IsOptional, IsString, validateSync } from 'class-validator';
import { StorageConfig } from './storage-config.type';

class EnvironmentVariablesValidator {
    @IsString()
    @IsOptional()
    STORAGE_R2_ACCOUNT_ID: string;

    @IsString()
    @IsOptional()
    STORAGE_R2_ACCESS_KEY_ID: string;

    @IsString()
    @IsOptional()
    STORAGE_R2_SECRET_ACCESS_KEY: string;

    @IsString()
    @IsOptional()
    STORAGE_R2_BUCKET: string;

    @IsString()
    @IsOptional()
    STORAGE_R2_PUBLIC_URL: string;
}

export default registerAs<StorageConfig>('storage', () => {
    const validatedConfig = validateSync(
        Object.assign(new EnvironmentVariablesValidator(), {
            STORAGE_R2_ACCOUNT_ID: process.env.STORAGE_R2_ACCOUNT_ID,
            STORAGE_R2_ACCESS_KEY_ID: process.env.STORAGE_R2_ACCESS_KEY_ID,
            STORAGE_R2_SECRET_ACCESS_KEY: process.env.STORAGE_R2_SECRET_ACCESS_KEY,
            STORAGE_R2_BUCKET: process.env.STORAGE_R2_BUCKET,
            STORAGE_R2_PUBLIC_URL: process.env.STORAGE_R2_PUBLIC_URL,
        }),
        { skipMissingProperties: false },
    );

    if (validatedConfig.length > 0) {
        console.error(validatedConfig.toString());
    }

    return {
        r2: {
            accountId: process.env.STORAGE_R2_ACCOUNT_ID,
            accessKeyId: process.env.STORAGE_R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.STORAGE_R2_SECRET_ACCESS_KEY,
            bucket: process.env.STORAGE_R2_BUCKET,
            publicUrl: process.env.STORAGE_R2_PUBLIC_URL,
        },
    };
});
