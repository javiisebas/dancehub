import { BaseTranslatableEntity, BaseTranslationEntity } from '@api/common/abstract/domain';
import { Injectable } from '@nestjs/common';
import type { PaginatedRequest } from '@repo/shared';
import { FALLBACK_LANGUAGE, PaginatedResponse } from '@repo/shared';
import { and, eq } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { I18nContext } from 'nestjs-i18n';
import { BaseRepository, EntityWithRelations } from './base.repository';
import { QueryOptions } from './types/query-options.types';
import { RelationMap } from './types/relation.types';
import { InferFields, InferRelations as InferRelationsHelper } from './types/type-helpers.types';

@Injectable()
export abstract class BaseTranslatableRepository<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TTable extends PgTable,
    TTranslationTable extends PgTable,
    TRelationMap extends RelationMap = RelationMap,
> extends BaseRepository<TEntity, TTable, TRelationMap> {
    protected abstract translationTable: TTranslationTable;

    protected abstract translationToDomain(schema: TTranslationTable['$inferSelect']): TTranslation;

    protected abstract translationToSchema(
        translation: TTranslation,
        entityId: string,
    ): Partial<TTranslationTable['$inferInsert']>;

    protected abstract getTranslationEntityIdColumn(): PgColumn;

    // CACHE STRATEGY: Only cache schema metadata (locale column), never entity data
    // This is safe because database schema doesn't change at runtime
    private localeColumnCache?: PgColumn;

    protected get currentLocale(): string {
        return I18nContext.current()?.lang || FALLBACK_LANGUAGE;
    }

    protected registerTranslationFields(): void {
        const translationColumns = Object.entries(this.translationTable).filter(
            ([_, value]) => value instanceof PgColumn,
        );

        const queryBuilder = this.getQueryBuilder();

        // Register nested fields in FieldMapper
        for (const [key, column] of translationColumns) {
            if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt') {
                queryBuilder['fieldMapper'].registerNestedField(
                    `translation.${key}`,
                    this.translationTable,
                    key,
                );
            }
        }

        // Set translation metadata for automatic JOINs
        queryBuilder.setTranslationMetadata({
            translationTable: this.translationTable,
            entityIdColumn: this.getTranslationEntityIdColumn(),
            localeColumn: this.getLocaleColumn(),
            getCurrentLocale: () => this.currentLocale,
        });
    }

    private getLocaleColumn(): PgColumn {
        if (this.localeColumnCache) {
            return this.localeColumnCache;
        }

        const localeColumn = Object.values(this.translationTable).find(
            (col): col is PgColumn =>
                col instanceof Object && 'name' in col && col.name === 'locale',
        ) as PgColumn;

        if (!localeColumn) {
            throw new Error('Locale column not found in translation table');
        }

        this.localeColumnCache = localeColumn;
        return localeColumn;
    }

    async loadTranslations(entityId: string): Promise<TTranslation[]> {
        const column = this.getTranslationEntityIdColumn();
        const result = await this.db
            .select()
            .from(this.translationTable)
            .where(eq(column, entityId));

        return result.map((r) => this.translationToDomain(r as TTranslationTable['$inferSelect']));
    }

    async loadTranslation(entityId: string, locale?: string): Promise<TTranslation | null> {
        const column = this.getTranslationEntityIdColumn();
        const localeColumn = this.getLocaleColumn();
        const targetLocale = locale || this.currentLocale;

        const result = await this.db
            .select()
            .from(this.translationTable)
            .where(and(eq(column, entityId), eq(localeColumn, targetLocale)))
            .limit(1);

        return result.length > 0
            ? this.translationToDomain(result[0] as TTranslationTable['$inferSelect'])
            : null;
    }

    private async loadTranslationWithFallback(
        entityId: string,
        locale?: string,
    ): Promise<TTranslation | null> {
        const targetLocale = locale || this.currentLocale;
        let translation = await this.loadTranslation(entityId, targetLocale);

        if (!translation && targetLocale !== FALLBACK_LANGUAGE) {
            translation = await this.loadTranslation(entityId, FALLBACK_LANGUAGE);
        }

        return translation;
    }

    private async attachTranslation(
        entity: TEntity,
        options?: QueryOptions<InferFields<TTable>, InferRelationsHelper<TRelationMap>>,
    ): Promise<TEntity> {
        const entityId = String((entity as any).id);

        entity.translation = (await this.loadTranslationWithFallback(entityId, options?.locale)) as
            | TTranslation
            | undefined;

        if (options?.includeAllTranslations) {
            entity.translations = (await this.loadTranslations(entityId)) as TTranslation[];
        }

        return entity;
    }

    private async attachTranslations(
        entities: TEntity[],
        options?: QueryOptions<InferFields<TTable>, InferRelationsHelper<TRelationMap>>,
    ): Promise<TEntity[]> {
        if (entities.length === 0) return entities;

        await Promise.all(entities.map((entity) => this.attachTranslation(entity, options)));

        return entities;
    }

    async findById(
        id: string | number,
        options?: QueryOptions<InferFields<TTable>, InferRelationsHelper<TRelationMap>>,
    ): Promise<TEntity | EntityWithRelations<TEntity, InferRelationsHelper<TRelationMap>>> {
        if (!this['_translationFieldsRegistered']) {
            this.registerTranslationFields();
            this['_translationFieldsRegistered'] = true;
        }

        const entity = await super.findById(id, options);
        await this.attachTranslation(entity, options);
        return entity;
    }

    async findOne(
        options?: QueryOptions<InferFields<TTable>, InferRelationsHelper<TRelationMap>>,
    ): Promise<TEntity | EntityWithRelations<TEntity, InferRelationsHelper<TRelationMap>> | null> {
        if (!this['_translationFieldsRegistered']) {
            this.registerTranslationFields();
            this['_translationFieldsRegistered'] = true;
        }

        const entity = await super.findOne(options);
        if (!entity) return null;

        await this.attachTranslation(entity, options);
        return entity;
    }

    async findMany(
        options?: QueryOptions<InferFields<TTable>, InferRelationsHelper<TRelationMap>>,
    ): Promise<TEntity[] | EntityWithRelations<TEntity, InferRelationsHelper<TRelationMap>>[]> {
        if (!this['_translationFieldsRegistered']) {
            this.registerTranslationFields();
            this['_translationFieldsRegistered'] = true;
        }

        const entities = await super.findMany(options);
        await this.attachTranslations(entities, options);
        return entities;
    }

    async paginate(
        request: PaginatedRequest<InferFields<TTable>>,
        options?: QueryOptions<InferFields<TTable>, InferRelationsHelper<TRelationMap>>,
    ): Promise<
        | PaginatedResponse<TEntity>
        | PaginatedResponse<EntityWithRelations<TEntity, InferRelationsHelper<TRelationMap>>>
    > {
        if (!this['_translationFieldsRegistered']) {
            this.registerTranslationFields();
            this['_translationFieldsRegistered'] = true;
        }

        const result = await super.paginate(request, options);
        await this.attachTranslations(result.data, options);
        return result;
    }

    async saveTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        if (translations.length === 0) return;

        const translationsToInsert = translations.map((t) => this.translationToSchema(t, entityId));

        await this.db.insert(this.translationTable).values(translationsToInsert as any);
    }

    async deleteTranslations(entityId: string): Promise<void> {
        const column = this.getTranslationEntityIdColumn();
        await this.db.delete(this.translationTable).where(eq(column, entityId));
    }

    async deleteTranslation(entityId: string, locale?: string): Promise<void> {
        const column = this.getTranslationEntityIdColumn();
        const localeColumn = this.getLocaleColumn();
        const targetLocale = locale || this.currentLocale;

        await this.db
            .delete(this.translationTable)
            .where(and(eq(column, entityId), eq(localeColumn, targetLocale)));
    }

    async updateTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        await this.deleteTranslations(entityId);
        await this.saveTranslations(entityId, translations);
    }

    async upsertTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        if (translations.length === 0) return;

        const column = this.getTranslationEntityIdColumn();
        const localeColumn = this.getLocaleColumn();

        for (const translation of translations) {
            const existing = await this.loadTranslation(entityId, translation.locale);

            if (existing) {
                const schema = this.translationToSchema(translation, entityId);
                const { id, createdAt, ...updateData } = schema as any;
                await this.db
                    .update(this.translationTable)
                    .set({ ...updateData, updatedAt: new Date() })
                    .where(and(eq(column, entityId), eq(localeColumn, translation.locale)));
            } else {
                const schema = this.translationToSchema(translation, entityId);
                await this.db.insert(this.translationTable).values(schema as any);
            }
        }
    }

    /**
     * Helper to create entity with translations in one transaction
     * Reduces boilerplate in create handlers
     */
    async createWithTranslations(entity: TEntity, translations: TTranslation[]): Promise<TEntity> {
        const savedEntity = await this.save(entity);
        await this.saveTranslations(savedEntity.id, translations);
        return this.findById(savedEntity.id, { includeAllTranslations: true });
    }

    /**
     * Helper to update entity with translations in one transaction
     * Reduces boilerplate in update handlers
     */
    async updateWithTranslations(entity: TEntity, translations?: TTranslation[]): Promise<TEntity> {
        await this.updateEntity(entity);
        if (translations && translations.length > 0) {
            await this.upsertTranslations(entity.id, translations);
        }
        return this.findById(entity.id, { includeAllTranslations: true });
    }
}
