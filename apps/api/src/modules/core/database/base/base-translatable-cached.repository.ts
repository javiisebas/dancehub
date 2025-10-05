import {
    BaseTranslatableEntity,
    BaseTranslationEntity,
    TranslatableComposite,
} from '@api/common/abstract/domain';
import { CacheTTL, TranslatableCacheService } from '@api/modules/core/cache';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { PgTable } from 'drizzle-orm/pg-core';
import { BaseTranslatableRepository } from './base-translatable.repository';

@Injectable()
export abstract class BaseTranslatableCachedRepository<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TTable extends PgTable,
    TTranslationTable extends PgTable,
    TField extends string = string,
> extends BaseTranslatableRepository<TEntity, TTranslation, TTable, TTranslationTable, TField> {
    protected abstract cacheEntityName: string;

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
        protected readonly translatableCache: TranslatableCacheService,
    ) {
        super(databaseService, unitOfWorkService, logger);
    }

    async findById(id: string): Promise<TEntity> {
        return this.translatableCache.getEntity(
            this.cacheEntityName,
            id,
            () => super.findById(id),
            CacheTTL.MEDIUM,
        );
    }

    async findByIdWithTranslation(
        id: string,
        locale: string,
    ): Promise<TranslatableComposite<TEntity, TTranslation>> {
        return this.translatableCache.getComposite(
            this.cacheEntityName,
            id,
            locale,
            () => super.findByIdWithTranslation(id, locale),
            CacheTTL.MEDIUM,
        );
    }

    async findByIdWithTranslations(
        id: string,
    ): Promise<TranslatableComposite<TEntity, TTranslation>> {
        return this.translatableCache.getCompositeAll(
            this.cacheEntityName,
            id,
            () => super.findByIdWithTranslations(id),
            CacheTTL.SHORT,
        );
    }

    async save(entity: TEntity): Promise<TEntity> {
        const saved = await super.save(entity);
        await this.translatableCache.invalidateEntity(this.cacheEntityName, saved.id);
        return saved;
    }

    async updateEntity(entity: TEntity): Promise<TEntity> {
        const updated = await super.updateEntity(entity);
        await this.translatableCache.invalidateAll(this.cacheEntityName, updated.id);
        return updated;
    }

    async delete(id: string): Promise<void> {
        await super.delete(id);
        await this.translatableCache.invalidateAll(this.cacheEntityName, id);
    }

    async saveTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        await super.saveTranslations(entityId, translations);
        await this.invalidateTranslationCache(entityId, translations);
    }

    async updateTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        await super.updateTranslations(entityId, translations);
        await this.invalidateTranslationCache(entityId, translations);
    }

    async upsertTranslations(entityId: string, translations: TTranslation[]): Promise<void> {
        await super.upsertTranslations(entityId, translations);
        await this.invalidateTranslationCache(entityId, translations);
    }

    private async invalidateTranslationCache(
        entityId: string,
        translations: TTranslation[],
    ): Promise<void> {
        await this.translatableCache.invalidateTranslations(this.cacheEntityName, entityId);
        await this.translatableCache.invalidateCompositeAll(this.cacheEntityName, entityId);

        for (const translation of translations) {
            await this.translatableCache.invalidateComposite(
                this.cacheEntityName,
                entityId,
                translation.locale,
            );
        }
    }
}
