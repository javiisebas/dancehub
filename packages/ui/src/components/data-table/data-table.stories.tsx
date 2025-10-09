import type { Meta, StoryObj } from '@storybook/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '../badge';
import { Button } from '../button';
import { DataTable } from './data-table';

const meta: Meta<typeof DataTable> = {
    title: 'UI/DataTable',
    component: DataTable,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
}

const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>;
        },
    },
    {
        id: 'actions',
        cell: () => {
            return (
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            );
        },
    },
];

const sampleData: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'active' },
    {
        id: '5',
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        role: 'User',
        status: 'active',
    },
];

export const Default: Story = {
    args: {
        columns,
        data: sampleData,
    },
};

export const Loading: Story = {
    args: {
        columns,
        data: [],
        isLoading: true,
    },
};

export const Empty: Story = {
    args: {
        columns,
        data: [],
        isLoading: false,
    },
};

export const WithPagination: Story = {
    args: {
        columns,
        data: [...sampleData, ...sampleData, ...sampleData],
        pagination: { page: 1, pageSize: 5 },
        pageCount: 3,
        manualPagination: true,
    },
};
