import { BaseTranslatableEntity, BaseTranslationEntity } from './base-translatable.entity';

export class TranslatableComposite<
    TEntity extends BaseTranslatableEntity,
    TTranslation extends BaseTranslationEntity,
> {
    constructor(
        public readonly entity: TEntity,
        public readonly translation: TTranslation | null,
        public readonly translations?: TTranslation[],
    ) {}

    hasTranslation(): boolean {
        return this.translation !== null;
    }

    hasTranslations(): boolean {
        return this.translations !== undefined && this.translations.length > 0;
    }

    getTranslation(locale: string): TTranslation | undefined {
        if (this.translation && this.translation.locale === locale) {
            return this.translation;
        }
        return this.translations?.find((t) => t.locale === locale);
    }

    getAllTranslations(): TTranslation[] {
        if (this.translations) {
            return this.translations;
        }
        return this.translation ? [this.translation] : [];
    }

    static fromEntity<T extends BaseTranslatableEntity>(entity: T): TranslatableComposite<T, any> {
        return new TranslatableComposite(entity, null);
    }

    static withTranslation<T extends BaseTranslatableEntity, U extends BaseTranslationEntity>(
        entity: T,
        translation: U | null,
    ): TranslatableComposite<T, U> {
        return new TranslatableComposite(entity, translation);
    }

    static withTranslations<T extends BaseTranslatableEntity, U extends BaseTranslationEntity>(
        entity: T,
        translations: U[],
    ): TranslatableComposite<T, U> {
        return new TranslatableComposite(entity, translations[0] || null, translations);
    }
}
