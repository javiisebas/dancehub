import { PgTable } from 'drizzle-orm/pg-core';
import { RelationConfig, RelationType } from './relation.types';

/**
 * Infer filterable field names from a Drizzle table schema
 * Extracts all column names except id, createdAt, updatedAt
 */
export type InferFields<TTable extends PgTable> =
    Exclude<keyof TTable['_']['columns'], 'id' | 'createdAt' | 'updatedAt'> extends infer K
        ? K extends string
            ? K
            : never
        : never;

/**
 * Infer the correct return type based on relation type
 * one-to-many and many-to-many return arrays, others return single entities
 */
type InferRelationType<TConfig> = TConfig extends { type: RelationType.ONE_TO_MANY }
    ? TConfig extends RelationConfig<infer TEntity>
        ? TEntity[]
        : never
    : TConfig extends { type: RelationType.MANY_TO_MANY }
      ? TConfig extends RelationConfig<infer TEntity>
          ? TEntity[]
          : never
      : TConfig extends { type: RelationType.MANY_TO_ONE }
        ? TConfig extends RelationConfig<infer TEntity>
            ? TEntity
            : never
        : TConfig extends { type: RelationType.ONE_TO_ONE }
          ? TConfig extends RelationConfig<infer TEntity>
              ? TEntity
              : never
          : never;

/**
 * Infer relation types from a relation map
 * Converts { albums: RelationConfig<Album> } to { albums: Album[] } for oneToMany
 * Converts { owner: RelationConfig<User> } to { owner: User } for manyToOne
 */
export type InferRelations<TRelationMap> =
    TRelationMap extends Record<string, any>
        ? {
              [K in keyof TRelationMap]: InferRelationType<TRelationMap[K]>;
          }
        : {};

/**
 * Extract entity class from relation config for auto-registration
 */
export type ExtractEntityClass<TEntity> = new (...args: any[]) => TEntity;

/**
 * Helper to infer entity name from entity class
 */
export type EntityName<TEntity> = TEntity extends { constructor: { name: string } }
    ? string
    : string;
