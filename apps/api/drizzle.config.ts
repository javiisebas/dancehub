import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config();

export default defineConfig({
    out: './src/modules/core/database/migrations',
    schema: './src/modules/core/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        user: process.env.DATABASE_USERNAME || 'dancehub',
        password: process.env.DATABASE_PASSWORD || 'dancehub123',
        database: process.env.DATABASE_NAME || 'dancehub',
        ssl: process.env.DATABASE_SSL === 'true',
    },
    verbose: true,
    strict: true,
});
