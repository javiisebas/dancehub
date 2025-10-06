import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { Inject, Injectable } from '@nestjs/common';
import { Storage } from '../../domain/entities/storage.entity';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';

export class GetStorageQuery {
    constructor(public readonly id: string) {}
}

@Injectable()
export class GetStorageHandler {
    constructor(@Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository) {}

    async execute({ id }: GetStorageQuery): Promise<Storage> {
        const storage = await this.repository.findById(id);
        if (!storage) {
            throw new NotFoundException(`Storage with id ${id} not found`);
        }
        return storage;
    }
}
