import {
    BaseTranslatableEntity,
    BaseTranslationEntity,
    TranslatableComposite,
} from '@api/common/abstract/domain';
import { Injectable } from '@nestjs/common';
import { FALLBACK_LANGUAGE } from '@repo/shared';
import { and, eq } from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import { BaseRepository } from './base.repository';

@Injectable()
export abstract class BaseTranslatableRepository<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TTable extends PgTable,
    TTranslationTable extends PgTable,
    TField extends string = string,
> extends BaseRepository<TEntity, TTable, TField> {
    protected abstract translationTable: TTranslationTable;

    protected abstract translationToDomain(schema: TTranslationTable['$inferSelect']): TTranslation;

    protected abstract translationToSchema(
        translation: TTranslation,
        entityId: string,
    ): Partial<TTranslationTable['$inferInsert']>;

    protected abstract getTranslationEntityIdColumn(): PgColumn;

    async loadTranslations(entityId: string): Promise<TTranslation[]> {
        const column = this.getTranslationEntityIdColumn();
        const result = await this.db
            .select()
            .from(this.translationTable)
            .where(eq(column, entityId));

        return result.map((r) => this.translationToDomain(r as TTranslationTable['$inferSelect']));
    }

    async loadTranslation(entityId: string, locale: string): Promise<TTranslation | null> {
        const column = this.getTranslationEntityIdColumn();
        const localeColumn = Object.values(this.translationTable).find(
            (col): col is PgColumn =>
                col instanceof Object && 'name' in col && col.name === 'locale',
        ) as PgColumn;

        const result = await this.db
            .select()
            .from(this.translationTable)
            .where(and(eq(column, entityId), eq(localeColumn, locale)))
            .limit(1);

        return result.length > 0
            ? this.translationToDomain(result[0] as TTranslationTable['$inferSelect'])
            : null;
    }

    async findByIdWithTranslation(
        id: string,
        locale: string,
    ): Promise<TranslatableComposite<TEntity, TTranslation>> {
        const entity = await this.findById(id);
        let translation = await this.loadTranslation(id, locale);

        if (!translation && locale !== FALLBACK_LANGUAGE) {
            translation = await this.loadTranslation(id, FALLBACK_LANGUAGE);
        }

        return TranslatableComposite.withTranslation(entity, translation);
    }

    async findByIdWithTranslations(
        id: string,
    ): Promise<TranslatableComposite<TEntity, TTranslation>> {
        const entity = await this.findById(id);
        const translations = await this.loadTranslations(id);
        return TranslatableComposite.withTranslations(entity, translations);
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

    async deleteTranslation(entityId: string, locale: string): Promise<void> {
        const column = this.getTranslationEntityIdColumn();
        const localeColumn = Object.values(this.translationTable).find(
            (col): col is PgColumn =>
                col instanceof Object && 'name' in col && col.name === 'locale',
        ) as PgColumn;

        await this.db
            .delete(this.translationTable)
            .where(and(eq(column, entityId), eq(localeColumn, locale)));
    }

    async updateTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        await this.deleteTranslations(entityId);
        await this.saveTranslations(entityId, translations);
    }

    async upsertTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        if (translations.length === 0) return;

        const column = this.getTranslationEntityIdColumn();
        const localeColumn = Object.values(this.translationTable).find(
            (col): col is PgColumn =>
                col instanceof Object && 'name' in col && col.name === 'locale',
        ) as PgColumn;

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
}
