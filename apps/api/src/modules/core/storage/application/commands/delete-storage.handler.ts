import { DeleteCommand } from '@api/common/abstract/application';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { Inject, Injectable } from '@nestjs/common';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';

export class DeleteStorageCommand extends DeleteCommand {}

@Injectable()
export class DeleteStorageHandler {
    constructor(@Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository) {}

    async execute({ id }: DeleteStorageCommand): Promise<void> {
        const storage = await this.repository.findById(id);
        if (!storage) {
            throw new NotFoundException(`Storage with id ${id} not found`);
        }

        storage.markAsDeleted();
        await this.repository.updateEntity(storage);
    }
}
