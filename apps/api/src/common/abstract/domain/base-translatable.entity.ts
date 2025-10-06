import { BaseEntity } from './base.entity';

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

export abstract class BaseTranslatableEntity<
    TTranslation extends BaseTranslationEntity = any,
> extends BaseEntity {
    translation?: TTranslation;
    translations?: TTranslation[];

    getTranslation(locale: string): TTranslation | undefined {
        if (this.translation?.locale === locale) {
            return this.translation;
        }
        return this.translations?.find((t) => t.locale === locale);
    }

    hasTranslation(locale?: string): boolean {
        if (!locale) {
            return !!this.translation;
        }
        return !!this.getTranslation(locale);
    }

    getAllTranslations(): TTranslation[] {
        if (this.translations) {
            return this.translations;
        }
        return this.translation ? [this.translation] : [];
    }
}
