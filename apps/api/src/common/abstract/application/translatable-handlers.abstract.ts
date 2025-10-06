import { IBaseTranslatableRepository } from '@api/modules/core/database/interfaces/i-base-translatable.repository';
import { BaseTranslatableEntity, BaseTranslationEntity } from '../domain';

export abstract class BaseGetTranslatableHandler<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
    TField extends string = string,
> {
    constructor(
        protected readonly repository: IBaseTranslatableRepository<TEntity, TTranslation, TField>,
    ) {}

    async execute(id: string, locale?: string): Promise<TEntity> {
        return this.repository.findById(id, {
            locale,
            includeAllTranslations: !locale,
        });
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
