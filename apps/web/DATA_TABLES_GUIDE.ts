/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATA TABLES - QUICK START GUIDE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Sistema profesional de tablas con TanStack Table v8
 *
 * FEATURES:
 * ✅ Server-side pagination
 * ✅ Server-side sorting
 * ✅ Server-side filtering
 * ✅ Row selection
 * ✅ Column visibility
 * ✅ TypeScript-first
 * ✅ Integración perfecta con la API
 * ✅ Loading states
 * ✅ Responsive design
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 🚀 QUICK START - 4 Pasos para crear una tabla
 * ─────────────────────────────────────────────────────────────────────────────
 */

// 1️⃣ API SERVICE (features/YOUR_FEATURE/api/YOUR_ENTITY.service.ts)
/*
import { apiClient } from '@web/shared/api';
import type { PaginatedYourEntityRequest, YourEntityPaginatedResponse } from '@repo/shared';

export const yourEntityService = {
  paginate: async (params: PaginatedYourEntityRequest): Promise<YourEntityPaginatedResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', JSON.stringify(params.sort));
    if (params.filter) queryParams.append('filter', JSON.stringify(params.filter));
    return apiClient.get<YourEntityPaginatedResponse>(`/your-entities?${queryParams.toString()}`);
  },
};
*/

// 2️⃣ HOOK (features/YOUR_FEATURE/hooks/use-YOUR_ENTITY-table.ts)
/*
'use client';
import { useServerTable } from '@web/shared/components/data-table';
import { yourEntityService } from '../api/YOUR_ENTITY.service';
import type { YourEntityResponse, PaginatedYourEntityRequest } from '@repo/shared';

export function useYourEntityTable() {
  return useServerTable<YourEntityResponse, string, PaginatedYourEntityRequest>({
    queryKey: ['your-entities'],
    queryFn: (request) => yourEntityService.paginate(request),
    initialPageSize: 10,
  });
}
*/

// 3️⃣ COLUMNS (features/YOUR_FEATURE/components/YOUR_ENTITY-columns.tsx)
/*
'use client';
import { ColumnDef } from '@tanstack/react-table';
import { YourEntityResponse } from '@repo/shared';
import {
  DataTableColumnHeader,
  DataTableSelectionCheckbox,
  DataTableSelectionHeader
} from '@web/shared/components/data-table';

export const yourEntityColumns: ColumnDef<YourEntityResponse>[] = [
  // ✅ Columna de selección con checkboxes (opcional)
  {
    id: 'select',
    header: ({ table }) => <DataTableSelectionHeader table={table} />,
    cell: ({ row }) => <DataTableSelectionCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
];
*/

// 4️⃣ TABLE COMPONENT (features/YOUR_FEATURE/components/YOUR_ENTITY-table.tsx)
/*
'use client';
import { DataTable, tanstackSortingToApi } from '@web/shared/components/data-table';
import { useYourEntityTable } from '../hooks/use-YOUR_ENTITY-table';
import { yourEntityColumns } from './YOUR_ENTITY-columns';

export function YourEntityTable() {
  const { data, isLoading, pagination, tableState, setPage, setPageSize, setSorting } = useYourEntityTable();

  return (
    <DataTable
      columns={yourEntityColumns}
      data={data}
      isLoading={isLoading}
      pageCount={pagination?.totalPages}
      pagination={{ page: tableState.pagination.page, pageSize: tableState.pagination.limit }}
      manualPagination
      manualSorting
      onPaginationChange={(page, pageSize) => { setPage(page); setPageSize(pageSize); }}
      onSortingChange={(sorting) => setSorting(tanstackSortingToApi(sorting))}
    />
  );
}
*/

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 📦 COMPONENTES DISPONIBLES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Ubicación: src/shared/components/data-table/
 *
 * • DataTable - Componente principal de tabla
 * • DataTablePagination - Controles de paginación mejorados
 * • DataTableColumnHeader - Header con sorting
 * • DataTableSelectionCheckbox - Checkbox para seleccionar fila ⭐ NUEVO
 * • DataTableSelectionHeader - Checkbox para seleccionar todo ⭐ NUEVO
 * • DataTableToolbar - Toolbar con búsqueda
 * • DataTableViewOptions - Toggle de columnas
 * • DataTableFacetedFilter - Filtros multi-select
 * • useServerTable - Hook para server-side state
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔧 OPERADORES DE FILTRO DISPONIBLES
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * FilterOperator.EQ - Igual
 * FilterOperator.NE - No igual
 * FilterOperator.GT - Mayor que
 * FilterOperator.GTE - Mayor o igual que
 * FilterOperator.LT - Menor que
 * FilterOperator.LTE - Menor o igual que
 * FilterOperator.LIKE - Patrón (case sensitive)
 * FilterOperator.ILIKE - Patrón (case insensitive) ⭐ Recomendado para búsquedas
 * FilterOperator.IN - Está en array
 * FilterOperator.NOT_IN - No está en array
 * FilterOperator.IS_NULL - Es null
 * FilterOperator.IS_NOT_NULL - No es null
 * FilterOperator.BETWEEN - Entre dos valores
 * FilterOperator.ARRAY_CONTAINS - Array contiene
 * FilterOperator.ARRAY_CONTAINED - Array contenido en
 * FilterOperator.ARRAY_OVERLAPS - Arrays se solapan
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 📝 EJEMPLO COMPLETO
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Ver ejemplo funcional en:
 * - src/features/users/ - Implementación completa
 * - src/app/[locale]/(protected)/examples/tables/page.tsx - Página de ejemplo
 *
 * Para ver el ejemplo en acción, navega a /examples/tables
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 📚 DOCUMENTACIÓN COMPLETA
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Ver: src/shared/components/data-table/USAGE.ts
 *
 * Incluye ejemplos de:
 * - Tablas básicas
 * - Filtros avanzados
 * - Acciones en filas
 * - Selección de filas
 * - Sorting inicial
 * - Filtros complejos
 */

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 🎯 PATRONES RECOMENDADOS
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ✅ PATRÓN RECOMENDADO: Estructura por feature
/*
features/
  users/
    api/
      users.service.ts         → API calls
    hooks/
      use-users-table.ts       → Table state
    components/
      users-columns.tsx        → Column definitions
      users-table.tsx          → Table component
    index.ts                   → Public exports
*/

// ✅ PATRÓN RECOMENDADO: Selección con Checkboxes
/*
import {
  DataTableSelectionCheckbox,
  DataTableSelectionHeader
} from '@repo/ui/components/data-table';

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => <DataTableSelectionHeader table={table} />,
    cell: ({ row }) => <DataTableSelectionCheckbox row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  // ... resto de columnas
];

// Uso en el componente
<DataTable
  columns={columns}
  data={data}
  enableRowSelection={true}
  onRowSelectionChange={(selectedRows) => {
    console.log('Filas seleccionadas:', selectedRows);
  }}
/>
*/

// ✅ PATRÓN RECOMENDADO: Búsqueda con ILIKE
/*
const handleSearch = () => {
  if (searchTerm.trim()) {
    setFilters([{
      field: 'name',
      operator: FilterOperator.ILIKE,
      value: `%${searchTerm}%`,  // ⚠️ Importante: usar % para wildcard
    }]);
  } else {
    setFilters([]);
  }
};
*/

// ✅ PATRÓN RECOMENDADO: Sorting inicial
/*
export function useYourEntityTable() {
  return useServerTable({
    queryKey: ['entities'],
    queryFn: (request) => service.paginate(request),
    initialPageSize: 10,
    initialSorting: [{
      field: 'createdAt',
      order: SortOrder.DESC,
    }],
  });
}
*/

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ ERRORES COMUNES Y SOLUCIONES
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ❌ NO HACER: Usar FilterOperator.CONTAINS (no existe)
// ✅ HACER: Usar FilterOperator.ILIKE con wildcards

// ❌ NO HACER: Olvidar el % en ILIKE
// setFilters([{ field: 'name', operator: FilterOperator.ILIKE, value: searchTerm }])
// ✅ HACER: Usar % para wildcard
// setFilters([{ field: 'name', operator: FilterOperator.ILIKE, value: `%${searchTerm}%` }])

// ❌ NO HACER: Olvidar manualPagination/manualSorting
// <DataTable columns={columns} data={data} />
// ✅ HACER: Especificar manualPagination y manualSorting
// <DataTable columns={columns} data={data} manualPagination manualSorting />

// ❌ NO HACER: Usar Math.random() o Date.now() en datos mock (causa errores de hidratación)
// const mockData = Array.from({length: 10}, (_, i) => ({
//   id: i,
//   role: ['admin', 'user'][Math.floor(Math.random() * 2)]  // ❌ Cambia en cada render
// }));
// ✅ HACER: Usar datos consistentes
// const mockData = Array.from({length: 10}, (_, i) => ({
//   id: i,
//   role: ['admin', 'user'][i % 2]  // ✅ Consistente
// }));

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * 🚀 TECNOLOGÍAS UTILIZADAS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * • TanStack Table v8 - Motor de tablas headless
 * • TanStack Query - State management y caching
 * • Radix UI - Componentes UI primitivos
 * • Tailwind CSS - Estilos
 * • TypeScript - Type safety
 */

export {};
