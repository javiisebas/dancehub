import type { SortingState } from '@tanstack/react-table';
import type { SortField } from '../../types/data-table.types';
import { SortOrder } from '../../types/data-table.types';

export function tanstackSortingToApi<TField extends string>(
    sorting: SortingState,
): SortField<TField>[] {
    return sorting.map((sort) => ({
        field: sort.id as TField,
        order: sort.desc ? SortOrder.DESC : SortOrder.ASC,
    }));
}

export function apiSortingToTanstack<TField extends string>(
    sorting: SortField<TField>[],
): SortingState {
    return sorting.map((sort) => ({
        id: sort.field,
        desc: sort.order === SortOrder.DESC,
    }));
}
