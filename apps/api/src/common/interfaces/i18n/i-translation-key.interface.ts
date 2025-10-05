import { Translations } from '../../../modules/core/i18n/translations/translations.type';

export type DotNestedKeys<T> = T extends object
    ? {
          [K in keyof T]-?: K extends string
              ? T[K] extends object
                  ? `${K}` | `${K}.${DotNestedKeys<T[K]>}`
                  : `${K}`
              : never;
      }[keyof T]
    : '';

export type DotNestedLeafKeys<T> = T extends object
    ? {
          [K in keyof T]-?: T[K] extends string
              ? K & string
              : `${K & string}.${DotNestedLeafKeys<T[K]>}`;
      }[keyof T]
    : never;

export type TranslationKey = DotNestedLeafKeys<Translations>;
