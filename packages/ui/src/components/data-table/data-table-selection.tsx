'use client';

import { Row, Table } from '@tanstack/react-table';
import { Checkbox } from '../checkbox';

interface DataTableSelectionCheckboxProps<TData> {
    row: Row<TData>;
}

export function DataTableSelectionCheckbox<TData>({ row }: DataTableSelectionCheckboxProps<TData>) {
    return (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        </div>
    );
}

interface DataTableSelectionHeaderProps<TData> {
    table: Table<TData>;
}

export function DataTableSelectionHeader<TData>({ table }: DataTableSelectionHeaderProps<TData>) {
    return (
        <div className="flex items-center justify-center">
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        </div>
    );
}
