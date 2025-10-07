import { RelationMap } from '../types/relation.types';

/**
 * Type-safe helper for defining relations
 * Provides better IntelliSense and validation when creating repository relations
 *
 * @example
 * ```typescript
 * const artistRelations = defineRelations({
 *   albums: relation.oneToMany({
 *     entity: Album,
 *     table: albums,
 *     foreignKey: 'artistId',
 *   }),
 * });
 * ```
 */
export function defineRelations<T extends RelationMap>(relations: T): T {
    return relations;
}

/**
 * Type helper for defining relations with table constraint
 * Ensures type safety at compile time
 */
export type DefineRelations<TRelations extends RelationMap> = TRelations;

/**
 * Helper to create properly typed relation definitions
 * Use this instead of plain objects for better type checking
 *
 * @example
 * ```typescript
 * const venueRelations = createRelations({
 *   danceStyles: relation.manyToMany({
 *     entity: DanceStyle,
 *     table: danceStyles,
 *     joinTable: venueDanceStyles,
 *     foreignKey: 'venueId',
 *     relatedKey: 'danceStyleId',
 *   }),
 * });
 * ```
 */
export const createRelations = defineRelations;

/**
 * Validate relation configuration at runtime
 * Useful for debugging relation setup issues
 */
export function validateRelations<T extends RelationMap>(relations: T, entityName: string): T {
    for (const [key, config] of Object.entries(relations)) {
        if (!config.type) {
            throw new Error(`Relation "${key}" in ${entityName} is missing "type" field`);
        }
        if (!config.table) {
            throw new Error(`Relation "${key}" in ${entityName} is missing "table" field`);
        }
    }
    return relations;
}
