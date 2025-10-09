'use client';

import type { PaginatedUserRequest, UserResponse } from '@repo/shared';
import { useServerTable } from '@repo/ui/components/data-table';
import { usersService } from '../api/users.service';

export function useUsersTable() {
    return useServerTable<UserResponse, string, PaginatedUserRequest>({
        queryKey: ['users'],
        queryFn: (request) => usersService.paginate(request),
        initialPageSize: 10,
    });
}
