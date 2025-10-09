import type { FilterCondition, PaginatedResponse, SortField } from '@repo/shared';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';

export interface DataTableProps<TData, TValue = unknown> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount?: number;
    isLoading?: boolean;
    onPaginationChange?: (page: number, pageSize: number) => void;
    onSortingChange?: (sorting: SortingState) => void;
    onFilterChange?: (filters: ColumnFiltersState) => void;
    pagination?: {
        page: number;
        pageSize: number;
    };
    manualPagination?: boolean;
    manualSorting?: boolean;
    manualFiltering?: boolean;
    enableRowSelection?: boolean;
    onRowSelectionChange?: (selectedRows: TData[]) => void;
}

export interface DataTablePaginationProps {
    table: any;
    isLoading?: boolean;
}

export interface ServerPaginationState {
    page: number;
    limit: number;
}

export interface ServerTableState<TField extends string = string> {
    pagination: ServerPaginationState;
    sorting: SortField<TField>[];
    filters: FilterCondition<TField>[];
}

export type UseServerTableReturn<TData, TField extends string = string> = {
    data: TData[];
    isLoading: boolean;
    error: Error | null;
    pagination: PaginatedResponse<TData> | null;
    tableState: ServerTableState<TField>;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSorting: (sorting: SortField<TField>[]) => void;
    setFilters: (filters: FilterCondition<TField>[]) => void;
    refetch: () => void;
};
