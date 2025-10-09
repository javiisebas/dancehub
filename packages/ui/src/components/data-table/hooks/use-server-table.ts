'use client';

import type { FilterCondition, PaginatedRequest, PaginatedResponse, SortField } from '@repo/shared';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import type { ServerTableState, UseServerTableReturn } from '../types';

interface UseServerTableOptions<
    TData,
    TField extends string,
    TRequest extends PaginatedRequest<TField>,
> {
    queryKey: string[];
    queryFn: (request: TRequest) => Promise<PaginatedResponse<TData>>;
    initialPageSize?: number;
    initialSorting?: SortField<TField>[];
    initialFilters?: FilterCondition<TField>[];
    enabled?: boolean;
}

export function useServerTable<
    TData,
    TField extends string = string,
    TRequest extends PaginatedRequest<TField> = PaginatedRequest<TField>,
>({
    queryKey,
    queryFn,
    initialPageSize = 10,
    initialSorting = [],
    initialFilters = [],
    enabled = true,
}: UseServerTableOptions<TData, TField, TRequest>): UseServerTableReturn<TData, TField> {
    const [tableState, setTableState] = useState<ServerTableState<TField>>({
        pagination: {
            page: 1,
            limit: initialPageSize,
        },
        sorting: initialSorting,
        filters: initialFilters,
    });

    const queryKeyWithState = useMemo(() => [...queryKey, tableState], [queryKey, tableState]);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: queryKeyWithState,
        queryFn: () => {
            const request = {
                page: tableState.pagination.page,
                limit: tableState.pagination.limit,
                ...(tableState.sorting.length > 0 && { sort: tableState.sorting as any }),
                ...(tableState.filters.length > 0 && { filter: tableState.filters as any }),
            } as TRequest;
            return queryFn(request);
        },
        enabled,
    });

    const setPage = useCallback((page: number) => {
        setTableState((prev) => ({
            ...prev,
            pagination: { ...prev.pagination, page },
        }));
    }, []);

    const setPageSize = useCallback((limit: number) => {
        setTableState((prev) => ({
            ...prev,
            pagination: { page: 1, limit },
        }));
    }, []);

    const setSorting = useCallback((sorting: SortField<TField>[]) => {
        setTableState((prev) => ({
            ...prev,
            sorting,
            pagination: { ...prev.pagination, page: 1 },
        }));
    }, []);

    const setFilters = useCallback((filters: FilterCondition<TField>[]) => {
        setTableState((prev) => ({
            ...prev,
            filters,
            pagination: { ...prev.pagination, page: 1 },
        }));
    }, []);

    return {
        data: data?.data ?? [],
        isLoading,
        error: error as Error | null,
        pagination: data ?? null,
        tableState,
        setPage,
        setPageSize,
        setSorting,
        setFilters,
        refetch,
    };
}
