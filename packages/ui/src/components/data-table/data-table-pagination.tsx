'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import type { DataTablePaginationProps } from './types';

export function DataTablePagination({ table, isLoading }: DataTablePaginationProps) {
    const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
    const totalRowsCount = table.getFilteredRowModel().rows.length;
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;

    return (
        <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
                {selectedRowsCount > 0 ? (
                    <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                            {selectedRowsCount} de {totalRowsCount}{' '}
                            {totalRowsCount === 1 ? 'fila seleccionada' : 'filas seleccionadas'}
                        </span>
                    </div>
                ) : (
                    <span className="font-medium">
                        {totalRowsCount} {totalRowsCount === 1 ? 'resultado' : 'resultados'}
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">Filas</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="h-9 w-[75px] border-border/50 shadow-sm">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50, 100].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-center text-sm font-medium text-muted-foreground min-w-[110px]">
                    <span className="text-foreground">{currentPage}</span>
                    <span className="mx-1.5">/</span>
                    <span>{totalPages}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-9 w-9 border-border/50 shadow-sm lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage() || isLoading}
                        title="Primera página"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 border-border/50 shadow-sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                        title="Página anterior"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 border-border/50 shadow-sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                        title="Página siguiente"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-9 w-9 border-border/50 shadow-sm lg:flex"
                        onClick={() => table.setPageIndex(totalPages - 1)}
                        disabled={!table.getCanNextPage() || isLoading}
                        title="Última página"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
