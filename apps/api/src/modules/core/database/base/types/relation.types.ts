import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

export enum RelationType {
    ONE_TO_ONE = 'one-to-one',
    ONE_TO_MANY = 'one-to-many',
    MANY_TO_ONE = 'many-to-one',
    MANY_TO_MANY = 'many-to-many',
}

export interface BaseRelationConfig<TRelatedEntity> {
    type: RelationType;
    relationName: string;
    toDomain: (schema: any) => TRelatedEntity;
}

export interface OneToOneConfig<TRelatedEntity, TRelatedTable extends PgTable>
    extends BaseRelationConfig<TRelatedEntity> {
    type: RelationType.ONE_TO_ONE;
    table: TRelatedTable;
    foreignKey: PgColumn;
    ownerKey?: PgColumn;
}

export interface OneToManyConfig<TRelatedEntity, TRelatedTable extends PgTable>
    extends BaseRelationConfig<TRelatedEntity> {
    type: RelationType.ONE_TO_MANY;
    table: TRelatedTable;
    foreignKey: PgColumn;
}

export interface ManyToOneConfig<TRelatedEntity, TRelatedTable extends PgTable>
    extends BaseRelationConfig<TRelatedEntity> {
    type: RelationType.MANY_TO_ONE;
    table: TRelatedTable;
    foreignKey: PgColumn;
}

export interface ManyToManyConfig<
    TRelatedEntity,
    TRelatedTable extends PgTable,
    TJoinTable extends PgTable,
> extends BaseRelationConfig<TRelatedEntity> {
    type: RelationType.MANY_TO_MANY;
    table: TRelatedTable;
    joinTable: TJoinTable;
    foreignKey: PgColumn;
    relatedKey: PgColumn;
}

export type RelationConfig<
    TRelatedEntity,
    TRelatedTable extends PgTable = PgTable,
    TJoinTable extends PgTable = PgTable,
> =
    | OneToOneConfig<TRelatedEntity, TRelatedTable>
    | OneToManyConfig<TRelatedEntity, TRelatedTable>
    | ManyToOneConfig<TRelatedEntity, TRelatedTable>
    | ManyToManyConfig<TRelatedEntity, TRelatedTable, TJoinTable>;

export type RelationMap = Record<string, RelationConfig<any, any, any>>;
