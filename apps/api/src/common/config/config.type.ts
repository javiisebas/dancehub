import { AppConfig } from './app/app-config.type';
import { AuthConfig } from './auth/auth-config.type';
import { CacheConfig } from './cache/cache-config.type';
import { DatabaseConfig } from './database/database-config.type';
import { StorageConfig } from './storage/storage-config.type';

export type AllConfigType = {
    app: AppConfig;
    cache: CacheConfig;
    database: DatabaseConfig;
    auth: AuthConfig;
    storage: StorageConfig;
};
