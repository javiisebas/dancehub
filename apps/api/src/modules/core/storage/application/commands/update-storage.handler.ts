import { UpdateCommand } from '@api/common/abstract/application';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateStorageRequest } from '@repo/shared';
import { Storage } from '../../domain/entities/storage.entity';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';

export class UpdateStorageCommand extends UpdateCommand<UpdateStorageRequest> {}

@Injectable()
export class UpdateStorageHandler {
    constructor(@Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository) {}

    async execute({ id, data }: UpdateStorageCommand): Promise<Storage> {
        const storage = await this.repository.findById(id);
        if (!storage) {
            throw new NotFoundException(`Storage with id ${id} not found`);
        }

        if (data.filename !== undefined) {
            storage.filename = data.filename;
        }

        if (data.visibility !== undefined) {
            storage.updateVisibility(data.visibility);
        }

        if (data.status !== undefined) {
            storage.updateStatus(data.status);
        }

        if (data.metadata !== undefined) {
            storage.updateMetadata(data.metadata);
        }

        return this.repository.updateEntity(storage);
    }
}
