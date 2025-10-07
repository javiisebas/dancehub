import { BaseTranslatableRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { FilterOperator } from '@repo/shared';
import { PgColumn } from 'drizzle-orm/pg-core';
import { DanceStyleTranslation } from '../../domain/entities/dance-style-translation.entity';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import { IDanceStyleRepository } from '../../domain/repositories/i-dance-style.repository';
import { danceStyles, danceStyleTranslations } from '../schemas';

@Injectable()
export class DanceStyleRepositoryImpl
    extends BaseTranslatableRepository<
        DanceStyle,
        DanceStyleTranslation,
        typeof danceStyles,
        typeof danceStyleTranslations
    >
    implements IDanceStyleRepository
{
    protected readonly table = danceStyles;
    protected readonly translationTable = danceStyleTranslations;
    protected readonly entityName = 'DanceStyle';

    protected toDomain(schema: typeof danceStyles.$inferSelect): DanceStyle {
        return new DanceStyle(schema.id, schema.slug, schema.createdAt, schema.updatedAt);
    }

    protected toSchema(entity: DanceStyle): Partial<typeof danceStyles.$inferInsert> {
        return {
            slug: entity.slug,
        };
    }

    protected translationToDomain(
        schema: typeof danceStyleTranslations.$inferSelect,
    ): DanceStyleTranslation {
        return new DanceStyleTranslation(
            schema.id,
            schema.locale,
            schema.name,
            schema.description,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected translationToSchema(
        translation: DanceStyleTranslation,
        entityId: string,
    ): Partial<typeof danceStyleTranslations.$inferInsert> {
        return {
            danceStyleId: entityId,
            locale: translation.locale,
            name: translation.name,
            description: translation.description || undefined,
        } as Partial<typeof danceStyleTranslations.$inferInsert>;
    }

    protected getTranslationEntityIdColumn(): PgColumn {
        return danceStyleTranslations.danceStyleId;
    }

    async findBySlug(slug: string): Promise<DanceStyle | null> {
        return this.findOne({
            filter: {
                field: 'slug',
                operator: FilterOperator.EQ,
                value: slug,
            },
        });
    }

    async slugExists(slug: string): Promise<boolean> {
        return this.exists({
            field: 'slug',
            operator: FilterOperator.EQ,
            value: slug,
        });
    }
}
