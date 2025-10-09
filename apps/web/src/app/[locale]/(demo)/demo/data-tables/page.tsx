'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import {
    DataTable,
    DataTableColumnHeader,
    DataTableSelectionCheckbox,
    DataTableSelectionHeader,
} from '@repo/ui/components/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Input } from '@repo/ui/components/input';
import { Separator } from '@repo/ui/components/separator';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, CheckCircle, Filter, LayoutList, MoreHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'moderator';
    status: 'active' | 'inactive' | 'pending';
    createdAt: string;
}

const generateMockUsers = (): User[] => {
    const roles: User['role'][] = ['admin', 'user', 'moderator'];
    const statuses: User['status'][] = ['active', 'inactive', 'pending'];
    const baseDate = new Date('2024-01-01').getTime();

    return Array.from({ length: 50 }, (_, i) => ({
        id: `user-${i + 1}`,
        name: `Usuario ${i + 1}`,
        email: `usuario${i + 1}@example.com`,
        role: roles[i % 3],
        status: statuses[i % 3],
        createdAt: new Date(baseDate + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    }));
};

const mockUsers = generateMockUsers();

export default function DataTablesDemoPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedRows, setSelectedRows] = useState<User[]>([]);

    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => <DataTableSelectionHeader table={table} />,
                cell: ({ row }) => <DataTableSelectionCheckbox row={row} />,
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'name',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
                cell: ({ row }) => {
                    return <div className="font-medium">{row.getValue('name')}</div>;
                },
            },
            {
                accessorKey: 'email',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
                cell: ({ row }) => {
                    return <div className="text-muted-foreground">{row.getValue('email')}</div>;
                },
            },
            {
                accessorKey: 'role',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
                cell: ({ row }) => {
                    const role = row.getValue('role') as string;
                    const roleColors = {
                        admin: 'bg-red-500/10 text-red-500 border-red-500/20',
                        moderator: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                        user: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
                    };
                    return (
                        <Badge
                            variant="outline"
                            className={roleColors[role as keyof typeof roleColors]}
                        >
                            {role}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
                cell: ({ row }) => {
                    const status = row.getValue('status') as string;
                    const statusColors = {
                        active: 'bg-green-500/10 text-green-500 border-green-500/20',
                        inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
                        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                    };
                    const statusLabels = {
                        active: 'Activo',
                        inactive: 'Inactivo',
                        pending: 'Pendiente',
                    };
                    return (
                        <Badge
                            variant="outline"
                            className={statusColors[status as keyof typeof statusColors]}
                        >
                            {statusLabels[status as keyof typeof statusLabels]}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Fecha Creación" />
                ),
                cell: ({ row }) => {
                    const date = new Date(row.getValue('createdAt'));
                    return <div className="text-sm">{date.toLocaleDateString('es-ES')}</div>;
                },
            },
            {
                id: 'actions',
                cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => navigator.clipboard.writeText(user.id)}
                                >
                                    Copiar ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    Eliminar usuario
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [],
    );

    const filteredData = useMemo(() => {
        let data = mockUsers;

        if (searchTerm) {
            data = data.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        if (statusFilter !== 'all') {
            data = data.filter((user) => user.status === statusFilter);
        }

        return data;
    }, [searchTerm, statusFilter]);

    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Link href="/demo">
                        <Button variant="ghost" size="sm">
                            ← Volver
                        </Button>
                    </Link>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Data Tables Demo</h1>
                <p className="text-xl text-muted-foreground">
                    Tablas de datos con paginación, ordenamiento y filtros avanzados
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LayoutList className="h-5 w-5" />
                                Tabla de Usuarios
                            </CardTitle>
                            <CardDescription>
                                Ejemplo con {mockUsers.length} usuarios de muestra
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Buscar por nombre o email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Filter className="h-4 w-4" />
                                            Estado:{' '}
                                            {statusFilter === 'all' ? 'Todos' : statusFilter}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                                            Todos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                                            Activos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setStatusFilter('inactive')}
                                        >
                                            Inactivos
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setStatusFilter('pending')}
                                        >
                                            Pendientes
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {selectedRows.length > 0 && (
                                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">
                                                {selectedRows.length}{' '}
                                                {selectedRows.length === 1 ? 'fila' : 'filas'}{' '}
                                                seleccionada{selectedRows.length === 1 ? '' : 's'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Haz clic en una fila o usa los checkboxes para
                                                seleccionar
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedRows([])}
                                        className="ml-auto gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Limpiar
                                    </Button>
                                </div>
                            )}

                            <DataTable
                                columns={columns}
                                data={filteredData}
                                enableRowSelection={true}
                                onRowSelectionChange={setSelectedRows}
                            />
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Características Demostradas</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <CheckCircle className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Paginación</p>
                                    <p className="text-xs text-muted-foreground">
                                        10, 20, 50, 100 filas por página
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <ArrowUpDown className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Ordenamiento</p>
                                    <p className="text-xs text-muted-foreground">
                                        Click en cabecera para ordenar
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Filter className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Filtros</p>
                                    <p className="text-xs text-muted-foreground">
                                        Búsqueda y filtros por columna
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <CheckCircle className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Selección Múltiple</p>
                                    <p className="text-xs text-muted-foreground">
                                        Checkboxes para seleccionar filas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estadísticas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                                <p className="text-2xl font-bold">{mockUsers.length}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Filtrados</p>
                                <p className="text-2xl font-bold">{filteredData.length}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Seleccionados</p>
                                <p className="text-2xl font-bold">{selectedRows.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Paginación client/server-side</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Ordenamiento multi-columna</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Filtros avanzados</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Selección múltiple</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Visibilidad de columnas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Acciones por fila</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Responsive design</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tecnología</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium">Tabla</p>
                                <p className="text-muted-foreground">TanStack Table v8</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Estado</p>
                                <p className="text-muted-foreground">React useState + useMemo</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Hook Custom</p>
                                <p className="text-muted-foreground">
                                    useServerTable (TanStack Query)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Casos de Uso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Gestión de usuarios</p>
                            <p>• Listado de productos</p>
                            <p>• Historial de pedidos</p>
                            <p>• Logs del sistema</p>
                            <p>• Reportes y analytics</p>
                            <p>• Administración de contenido</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
