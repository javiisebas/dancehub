import {
    BaseTranslatableEntity,
    BaseTranslationEntity,
    TranslatableComposite,
} from '@api/common/abstract/domain';
import { IBaseRepository } from './base.repository.interface';

export interface IBaseTranslatableRepository<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TField extends string = string,
> extends IBaseRepository<TEntity, TField> {
    loadTranslations(entityId: string): Promise<TTranslation[]>;
    loadTranslation(entityId: string, locale: string): Promise<TTranslation | null>;
    findByIdWithTranslation(
        id: string,
        locale: string,
    ): Promise<TranslatableComposite<TEntity, TTranslation>>;
    findByIdWithTranslations(id: string): Promise<TranslatableComposite<TEntity, TTranslation>>;
    saveTranslations(entityId: string, translations: TTranslation[]): Promise<void>;
    deleteTranslations(entityId: string): Promise<void>;
    deleteTranslation(entityId: string, locale: string): Promise<void>;
    updateTranslations(entityId: string, translations: TTranslation[]): Promise<void>;
    upsertTranslations(entityId: string, translations: TTranslation[]): Promise<void>;
}
