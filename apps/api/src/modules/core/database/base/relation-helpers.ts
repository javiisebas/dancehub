import { Filter, FilterOperator } from '@repo/shared';
import { IBaseRepository } from './base.repository.interface';

export class RelationHelpers {
    static oneToMany<TRelated>(
        repository: IBaseRepository<TRelated, any>,
        foreignKey: string,
    ): (parentIds: Array<string | number>) => Promise<Map<string | number, TRelated[]>> {
        return async (parentIds: Array<string | number>) => {
            if (parentIds.length === 0) {
                return new Map();
            }

            const filter: Filter<any> = {
                field: foreignKey,
                operator: FilterOperator.IN,
                value: parentIds as any,
            };

            const relatedEntities = await repository.findMany(filter);

            const grouped = new Map<string | number, TRelated[]>();
            for (const parentId of parentIds) {
                grouped.set(parentId, []);
            }

            for (const entity of relatedEntities) {
                const fkValue = (entity as any)[foreignKey];
                if (fkValue && grouped.has(fkValue)) {
                    grouped.get(fkValue)!.push(entity);
                }
            }

            return grouped;
        };
    }

    static manyToOne<TRelated>(
        repository: IBaseRepository<TRelated, any>,
        foreignKey: string,
    ): (parentIds: Array<string | number>) => Promise<Map<string | number, TRelated | null>> {
        return async (parentIds: Array<string | number>) => {
            if (parentIds.length === 0) {
                return new Map();
            }

            const filter: Filter<any> = {
                field: 'id',
                operator: FilterOperator.IN,
                value: parentIds as any,
            };

            const relatedEntities = await repository.findMany(filter);

            const mapped = new Map<string | number, TRelated | null>();
            for (const parentId of parentIds) {
                mapped.set(parentId, null);
            }

            for (const entity of relatedEntities) {
                const id = (entity as any).id;
                if (id) {
                    mapped.set(id, entity);
                }
            }

            return mapped;
        };
    }

    static oneToOne<TRelated>(
        repository: IBaseRepository<TRelated, any>,
        foreignKey: string,
    ): (parentIds: Array<string | number>) => Promise<Map<string | number, TRelated | null>> {
        return async (parentIds: Array<string | number>) => {
            if (parentIds.length === 0) {
                return new Map();
            }

            const filter: Filter<any> = {
                field: foreignKey,
                operator: FilterOperator.IN,
                value: parentIds as any,
            };

            const relatedEntities = await repository.findMany(filter);

            const mapped = new Map<string | number, TRelated | null>();
            for (const parentId of parentIds) {
                mapped.set(parentId, null);
            }

            for (const entity of relatedEntities) {
                const fkValue = (entity as any)[foreignKey];
                if (fkValue) {
                    mapped.set(fkValue, entity);
                }
            }

            return mapped;
        };
    }

    static manyToManyViaJunction<TRelated>(
        repository: IBaseRepository<TRelated, any>,
        junctionLoader: (
            parentIds: Array<string | number>,
        ) => Promise<Array<{ parentId: string | number; relatedId: string | number }>>,
    ): (parentIds: Array<string | number>) => Promise<Map<string | number, TRelated[]>> {
        return async (parentIds: Array<string | number>) => {
            if (parentIds.length === 0) {
                return new Map();
            }

            const junctionRecords = await junctionLoader(parentIds);

            const relatedIds = [...new Set(junctionRecords.map((r) => r.relatedId))];

            if (relatedIds.length === 0) {
                const emptyMap = new Map<string | number, TRelated[]>();
                for (const parentId of parentIds) {
                    emptyMap.set(parentId, []);
                }
                return emptyMap;
            }

            const filter: Filter<any> = {
                field: 'id',
                operator: FilterOperator.IN,
                value: relatedIds as any,
            };

            const relatedEntities = await repository.findMany(filter);

            const relatedMap = new Map<string | number, TRelated>();
            for (const entity of relatedEntities) {
                const id = (entity as any).id;
                if (id) {
                    relatedMap.set(id, entity);
                }
            }

            const grouped = new Map<string | number, TRelated[]>();
            for (const parentId of parentIds) {
                grouped.set(parentId, []);
            }

            for (const junction of junctionRecords) {
                const related = relatedMap.get(junction.relatedId);
                if (related && grouped.has(junction.parentId)) {
                    grouped.get(junction.parentId)!.push(related);
                }
            }

            return grouped;
        };
    }

    static custom<TRelated>(
        loader: (
            parentIds: Array<string | number>,
        ) => Promise<Map<string | number, TRelated | TRelated[]>>,
    ): (parentIds: Array<string | number>) => Promise<Map<string | number, TRelated | TRelated[]>> {
        return loader;
    }
}

