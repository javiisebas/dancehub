import { GetPaginatedQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedStorageRequest } from '@repo/shared';
import { IStorageRepository, STORAGE_REPOSITORY } from '../../domain/repositories/i-storage.repository';

export class GetPaginatedStoragesQuery extends GetPaginatedQuery<PaginatedStorageRequest> {}

@Injectable()
export class GetPaginatedStoragesHandler {
    constructor(@Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository) {}

    async execute({ data }: GetPaginatedStoragesQuery) {
        return this.repository.paginate(data);
    }
}
