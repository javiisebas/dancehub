'use client';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnFiltersState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table';
import { DataTablePagination } from './data-table-pagination';
import type { DataTableProps } from './types';

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    isLoading = false,
    onPaginationChange,
    onSortingChange,
    onFilterChange,
    pagination,
    manualPagination = false,
    manualSorting = false,
    manualFiltering = false,
    enableRowSelection = false,
    onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const memoizedData = useMemo(() => data, [data]);
    const memoizedColumns = useMemo(() => columns, [columns]);

    const table = useReactTable({
        data: memoizedData,
        columns: memoizedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
        getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
        getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination,
        manualSorting,
        manualFiltering,
        pageCount: pageCount ?? -1,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            ...(pagination && {
                pagination: {
                    pageIndex: pagination.page - 1,
                    pageSize: pagination.pageSize,
                },
            }),
        },
        enableRowSelection,
    });

    useEffect(() => {
        if (onSortingChange) {
            onSortingChange(sorting);
        }
    }, [sorting, onSortingChange]);

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange(columnFilters);
        }
    }, [columnFilters, onFilterChange]);

    useEffect(() => {
        if (onPaginationChange && pagination) {
            const state = table.getState().pagination;
            onPaginationChange(state.pageIndex + 1, state.pageSize);
        }
    }, [table.getState().pagination]);

    useEffect(() => {
        if (onRowSelectionChange && enableRowSelection) {
            const selectedRows = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original);
            onRowSelectionChange(selectedRows);
        }
    }, [rowSelection, onRowSelectionChange, enableRowSelection]);

    const headerGroups = table.getHeaderGroups();
    const rowModel = table.getRowModel();
    const hasRows = rowModel.rows?.length > 0;

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-border/50 bg-background shadow-sm">
                <Table>
                    <TableHeader>
                        {headerGroups.map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-0">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="relative h-8 w-8">
                                            <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Cargando datos...
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : hasRows ? (
                            rowModel.rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className={cn(enableRowSelection && 'cursor-pointer')}
                                    onClick={
                                        enableRowSelection ? () => row.toggleSelected() : undefined
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="rounded-full bg-muted p-3">
                                            <svg
                                                className="h-6 w-6 text-muted-foreground"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">No hay resultados</p>
                                            <p className="text-xs text-muted-foreground">
                                                Intenta ajustar los filtros de búsqueda
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} isLoading={isLoading} />
        </div>
    );
}
