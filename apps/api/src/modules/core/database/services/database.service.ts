import { TypedConfigService } from '@api/modules/core/config/config.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private client: postgres.Sql;
    public db: PostgresJsDatabase<typeof schema>;

    constructor(
        private readonly configService: TypedConfigService,
        private readonly logger: LogService,
    ) {}

    async onModuleInit() {
        const databaseUrl = this.configService.get('database.url') || this.buildDatabaseUrl();

        this.logger.log('Initializing database connection', 'DatabaseService');

        this.client = postgres(databaseUrl, {
            max: this.configService.get('database.maxConnections') || 100,
            idle_timeout: this.configService.get('database.idleTimeout') || 30000,
            connect_timeout: this.configService.get('database.connectionTimeout') || 5000,
        });

        this.db = drizzle(this.client, { schema, logger: false });

        this.logger.log('Database connection initialized successfully', 'DatabaseService');
    }

    async onModuleDestroy() {
        this.logger.log('Closing database connection', 'DatabaseService');
        await this.client.end();
    }

    private buildDatabaseUrl(): string {
        const host = this.configService.get('database.host') || 'localhost';
        const port = this.configService.get('database.port') || 5432;
        const username = this.configService.get('database.username') || '';
        const password = this.configService.get('database.password') || '';
        const database = this.configService.get('database.name') || '';

        return `postgresql://${username}:${password}@${host}:${port}/${database}`;
    }
}
