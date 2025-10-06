import { Injectable } from '@nestjs/common';

export interface EntityRelationship {
    entity: string;
    relation: string;
    relatedEntity: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
    inverseSide?: string;
}

@Injectable()
export class RelationshipManager {
    private readonly relationships = new Map<string, EntityRelationship[]>();

    registerRelationship(config: EntityRelationship): void {
        const key = this.getKey(config.entity, config.relation);
        if (!this.relationships.has(key)) {
            this.relationships.set(key, []);
        }
        this.relationships.get(key)!.push(config);

        if (config.inverseSide) {
            const inverseKey = this.getKey(config.relatedEntity, config.inverseSide);
            if (!this.relationships.has(inverseKey)) {
                this.relationships.set(inverseKey, []);
            }
            this.relationships.get(inverseKey)!.push({
                entity: config.relatedEntity,
                relation: config.inverseSide,
                relatedEntity: config.entity,
                type: this.getInverseType(config.type),
            });
        }
    }

    getRelationship(entity: string, relation: string): EntityRelationship | undefined {
        const key = this.getKey(entity, relation);
        const relationships = this.relationships.get(key);
        return relationships?.[0];
    }

    getEntityRelationships(entity: string): EntityRelationship[] {
        const result: EntityRelationship[] = [];
        for (const [key, relationships] of this.relationships.entries()) {
            if (key.startsWith(`${entity}:`)) {
                result.push(...relationships);
            }
        }
        return result;
    }

    getAffectedEntities(
        entity: string,
        id: string | number,
    ): Array<{
        entity: string;
        relation?: string;
    }> {
        const affected: Array<{ entity: string; relation?: string }> = [{ entity }];

        const relationships = this.getEntityRelationships(entity);
        for (const rel of relationships) {
            if (rel.inverseSide) {
                affected.push({
                    entity: rel.relatedEntity,
                    relation: rel.inverseSide,
                });
            }
        }

        return affected;
    }

    private getKey(entity: string, relation: string): string {
        return `${entity}:${relation}`;
    }

    private getInverseType(type: EntityRelationship['type']): EntityRelationship['type'] {
        switch (type) {
            case 'one-to-one':
                return 'one-to-one';
            case 'one-to-many':
                return 'many-to-one';
            case 'many-to-one':
                return 'one-to-many';
            case 'many-to-many':
                return 'many-to-many';
        }
    }
}
