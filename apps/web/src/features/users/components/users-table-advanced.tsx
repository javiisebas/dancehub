'use client';

import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { FilterOperator } from '@repo/shared';
import { DataTable, tanstackSortingToApi } from '@repo/ui/components/data-table';
import { useState } from 'react';
import { useUsersTable } from '../hooks/use-users-table';
import { usersColumns } from './users-columns';

export function UsersTableAdvanced() {
    const {
        data,
        isLoading,
        pagination,
        tableState,
        setPage,
        setPageSize,
        setSorting,
        setFilters,
    } = useUsersTable();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            setFilters([
                {
                    field: 'name',
                    operator: FilterOperator.ILIKE,
                    value: `%${searchTerm}%`,
                },
            ]);
        } else {
            setFilters([]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="max-w-sm"
                />
                <Button onClick={handleSearch}>Search</Button>
                {tableState.filters.length > 0 && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setFilters([]);
                            setSearchTerm('');
                        }}
                    >
                        Clear
                    </Button>
                )}
            </div>

            <DataTable
                columns={usersColumns}
                data={data}
                isLoading={isLoading}
                pageCount={pagination?.totalPages}
                pagination={{
                    page: tableState.pagination.page,
                    pageSize: tableState.pagination.limit,
                }}
                manualPagination
                manualSorting
                manualFiltering
                onPaginationChange={(page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                }}
                onSortingChange={(sorting) => {
                    setSorting(tanstackSortingToApi(sorting));
                }}
            />
        </div>
    );
}
