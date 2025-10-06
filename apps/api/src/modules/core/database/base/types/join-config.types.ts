import { PgTable } from 'drizzle-orm/pg-core';

export type JoinType = 'inner' | 'left';

export interface JoinConfig {
    table: PgTable;
    type: JoinType;
    on: {
        leftColumn: any;
        rightColumn: any;
        additionalConditions?: any[];
    };
    alias?: string;
}

export interface TranslationJoinMetadata {
    translationTable: PgTable;
    entityIdColumn: any;
    localeColumn: any;
    getCurrentLocale: () => string;
}
