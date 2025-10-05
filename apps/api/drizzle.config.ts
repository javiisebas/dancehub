import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/modules/core/database/migrations',
    schema: './src/modules/core/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: 'localhost',
        port: 5432,
        user: 'dancehub',
        password: 'dancehub123',
        database: 'dancehub',
        ssl: false,
    },
    verbose: true,
    strict: true,
});
