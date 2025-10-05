import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../schema';

type DbTransaction = Parameters<Parameters<PostgresJsDatabase<typeof schema>['transaction']>[0]>[0];

@Injectable()
export class UnitOfWorkService {
    private readonly storage = new AsyncLocalStorage<DbTransaction>();

    getTransaction(): DbTransaction | undefined {
        return this.storage.getStore();
    }

    async runInTransaction<T>(
        db: PostgresJsDatabase<typeof schema>,
        callback: () => Promise<T>,
    ): Promise<T> {
        return db.transaction(async (tx) => {
            return this.storage.run(tx, callback);
        });
    }
}
