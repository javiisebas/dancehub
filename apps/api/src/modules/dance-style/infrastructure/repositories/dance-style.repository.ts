import { TranslatableCacheService } from '@api/modules/core/cache';
import { BaseTranslatableCachedRepository } from '@api/modules/core/database/base/base-translatable-cached.repository';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { DanceStyleField, FilterOperator } from '@repo/shared';
import { PgColumn } from 'drizzle-orm/pg-core';
import { DanceStyleTranslation } from '../../domain/entities/dance-style-translation.entity';
import { DanceStyle } from '../../domain/entities/dance-style.entity';
import { IDanceStyleRepository } from '../../domain/repositories/i-dance-style.repository';
import { danceStyles, danceStyleTranslations } from '../schemas';

@Injectable()
export class DanceStyleRepositoryImpl
    extends BaseTranslatableCachedRepository<
        DanceStyle,
        DanceStyleTranslation,
        typeof danceStyles,
        typeof danceStyleTranslations,
        DanceStyleField
    >
    implements IDanceStyleRepository
{
    protected table = danceStyles;
    protected translationTable = danceStyleTranslations;
    protected entityName = 'DanceStyle';
    protected cacheEntityName = 'dance-style';

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
        translatableCache: TranslatableCacheService,
    ) {
        super(databaseService, unitOfWorkService, logger, translatableCache);
    }

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
            field: 'slug',
            operator: FilterOperator.EQ,
            value: slug,
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
