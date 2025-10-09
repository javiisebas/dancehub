import { PaginatedStorageRequest, StoragePaginatedResponse } from '@repo/shared';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { StorageService } from '../api/storage.service';

export interface UseStorageListOptions extends PaginatedStorageRequest {
    enabled?: boolean;
}

export const useStorageList = (
    options: UseStorageListOptions = {},
): UseQueryResult<StoragePaginatedResponse, Error> => {
    const { enabled = true, ...params } = options;

    return useQuery({
        queryKey: ['storage', 'list', params],
        queryFn: () => StorageService.listFiles(params),
        enabled,
    });
};
