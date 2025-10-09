import type {
    CreateUserRequest,
    PaginatedUserRequest,
    UpdateUserRequest,
    UserPaginatedResponse,
    UserResponse,
} from '@repo/shared';
import { BaseApiService } from '@web/lib/api';

class UsersService extends BaseApiService {
    constructor() {
        super('/users');
    }

    async paginate(params: PaginatedUserRequest): Promise<UserPaginatedResponse> {
        return super.paginate<UserPaginatedResponse>(params);
    }

    async getById(id: string): Promise<UserResponse> {
        return this.get<UserResponse>(`/${id}`);
    }

    async create(data: CreateUserRequest): Promise<UserResponse> {
        return this.post<UserResponse, CreateUserRequest>('', data);
    }

    async update(id: string, data: UpdateUserRequest): Promise<UserResponse> {
        return this.patch<UserResponse, UpdateUserRequest>(`/${id}`, data);
    }

    async delete(id: string): Promise<void> {
        return super.delete<void>(`/${id}`);
    }

    async search(searchTerm: string, limit: number = 10): Promise<UserResponse[]> {
        return this.get<UserResponse[]>('', {
            queryParams: { search: searchTerm, limit },
        });
    }
}

export const usersService = new UsersService();
