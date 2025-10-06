import { BaseTranslatableEntity, BaseTranslationEntity } from '@api/common/abstract/domain';
import { IBaseRepository } from './i-base.repository';

export interface IBaseTranslatableRepository<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TField extends string = string,
    TRelations extends Record<string, any> = {},
> extends IBaseRepository<TEntity, TField, TRelations> {
    loadTranslations(entityId: string): Promise<TTranslation[]>;
    loadTranslation(entityId: string, locale?: string): Promise<TTranslation | null>;
    saveTranslations(entityId: string, translations: TTranslation[]): Promise<void>;
    deleteTranslations(entityId: string): Promise<void>;
    deleteTranslation(entityId: string, locale?: string): Promise<void>;
    updateTranslations(entityId: string, translations: TTranslation[]): Promise<void>;
    upsertTranslations(entityId: string, translations: TTranslation[]): Promise<void>;
}
