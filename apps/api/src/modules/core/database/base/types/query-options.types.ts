import type { Filter, Sort } from '@repo/shared';

export type QueryOptions<
    TField extends string = string,
    TRelations extends Record<string, any> = {},
> = {
    filter?: Filter<TField>;
    sort?: Sort<TField>;
    limit?: number;
    with?: (keyof TRelations | string)[];
    locale?: string;
    includeAllTranslations?: boolean;
};
