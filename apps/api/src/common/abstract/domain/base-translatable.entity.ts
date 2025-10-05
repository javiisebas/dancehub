import { BaseEntity } from './base.entity';

export abstract class BaseTranslatableEntity extends BaseEntity {}

export abstract class BaseTranslationEntity extends BaseEntity {
    constructor(
        id: string,
        public locale: string,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }
}
