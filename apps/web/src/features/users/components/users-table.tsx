'use client';

import { DataTable, tanstackSortingToApi } from '@repo/ui/components/data-table';
import { useUsersTable } from '../hooks/use-users-table';
import { usersColumns } from './users-columns';

export function UsersTable() {
    const { data, isLoading, pagination, tableState, setPage, setPageSize, setSorting } =
        useUsersTable();

    return (
        <div className="space-y-4">
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
