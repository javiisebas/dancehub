export type RelationLoader<TRelated = any> = (
    parentIds: Array<string | number>,
) => Promise<Map<string | number, TRelated>>;

export interface RelationDefinition<TRelated = any> {
    name: string;
    type: 'one' | 'many';
    loader: RelationLoader<TRelated>;
}

export class RelationBuilder<TRelated = any> {
    constructor(
        private readonly relationName: string,
        private readonly registry: Map<string, RelationDefinition>,
    ) {}

    one(loader: RelationLoader<TRelated | null>): void {
        this.registry.set(this.relationName, {
            name: this.relationName,
            type: 'one',
            loader,
        });
    }

    many(loader: RelationLoader<TRelated[]>): void {
        this.registry.set(this.relationName, {
            name: this.relationName,
            type: 'many',
            loader,
        });
    }
}

export interface WithRelationsOptions {
    relations?: string[];
}

export class RelationRegistry {
    private readonly definitions = new Map<string, RelationDefinition>();

    relation<TRelated = any>(name: string): RelationBuilder<TRelated> {
        return new RelationBuilder<TRelated>(name, this.definitions);
    }

    getRelation(name: string): RelationDefinition | undefined {
        return this.definitions.get(name);
    }

    getAllRelations(): string[] {
        return Array.from(this.definitions.keys());
    }

    async applyRelations<TEntity>(
        entities: TEntity[],
        relationNames: string[],
    ): Promise<TEntity[]> {
        if (entities.length === 0 || relationNames.length === 0) {
            return entities;
        }

        const entityIds = entities.map((e: any) => e.id);
        const relationDataMap = new Map<string, Map<string | number, any>>();

        await Promise.all(
            relationNames.map(async (relationName) => {
                const definition = this.getRelation(relationName);
                if (definition) {
                    const data = await definition.loader(entityIds);
                    relationDataMap.set(relationName, data);
                }
            }),
        );

        return entities.map((entity: any) => {
            const enriched = { ...entity };
            for (const relationName of relationNames) {
                const relationData = relationDataMap.get(relationName);
                const definition = this.getRelation(relationName);
                
                if (relationData && definition) {
                    if (definition.type === 'one') {
                        enriched[relationName] = relationData.get(entity.id) ?? null;
                    } else {
                        enriched[relationName] = relationData.get(entity.id) ?? [];
                    }
                }
            }
            return enriched as TEntity;
        });
    }
}

