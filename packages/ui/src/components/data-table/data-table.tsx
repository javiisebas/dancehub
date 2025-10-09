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
            <div className="rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        {headerGroups.map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="bg-muted/50">
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
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <p className="text-sm text-muted-foreground">
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
                                    className={cn(
                                        'transition-colors',
                                        enableRowSelection && 'cursor-pointer hover:bg-muted/50',
                                    )}
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
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <p className="text-sm font-medium">No hay resultados</p>
                                        <p className="text-xs text-muted-foreground">
                                            Intenta ajustar los filtros de búsqueda
                                        </p>
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
