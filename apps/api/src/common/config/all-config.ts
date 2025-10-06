import appConfig from './app/app.config';
import authConfig from './auth/auth.config';
import oauthConfig from './auth/oauth.config';
import cacheConfig from './cache/cache.config';
import databaseConfig from './database/database.config';
import paymentConfig from './payment/payment.config';
import storageConfig from './storage/storage.config';

export const allConfig = [
    appConfig,
    authConfig,
    oauthConfig,
    cacheConfig,
    databaseConfig,
    paymentConfig,
    storageConfig,
];
