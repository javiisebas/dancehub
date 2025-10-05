import { IBaseTranslatableRepository } from '@api/modules/core/database/base/base-translatable.repository.interface';
import { BaseTranslatableEntity, BaseTranslationEntity, TranslatableComposite } from '../domain';

export abstract class BaseGetTranslatableHandler<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TField extends string = string,
> {
    constructor(
        protected readonly repository: IBaseTranslatableRepository<TEntity, TTranslation, TField>,
    ) {}

    async execute(
        id: string,
        locale?: string,
    ): Promise<TranslatableComposite<TEntity, TTranslation>> {
        if (locale) {
            return this.repository.findByIdWithTranslation(id, locale);
        }
        return this.repository.findByIdWithTranslations(id);
    }
}

export abstract class BaseGetPaginatedTranslatableHandler<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TField extends string = string,
> {
    constructor(
        protected readonly repository: IBaseTranslatableRepository<TEntity, TTranslation, TField>,
    ) {}

    async execute(data: any) {
        return this.repository.paginate(data);
    }
}

export abstract class BaseDeleteTranslatableHandler<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TField extends string = string,
> {
    constructor(
        protected readonly repository: IBaseTranslatableRepository<TEntity, TTranslation, TField>,
    ) {}

    async execute(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
