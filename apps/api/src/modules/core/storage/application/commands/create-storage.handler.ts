import { CreateCommand } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { CreateStorageRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Storage } from '../../domain/entities/storage.entity';
import { IStorageRepository, STORAGE_REPOSITORY } from '../../domain/repositories/i-storage.repository';

export class CreateStorageCommand extends CreateCommand<CreateStorageRequest> {}

@Injectable()
export class CreateStorageHandler {
    constructor(@Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository) {}

    async execute({ data }: CreateStorageCommand): Promise<Storage> {
        const storage = Storage.create(
            randomUUID(),
            data.filename,
            data.originalName,
            data.mimeType,
            data.extension,
            data.size,
            data.path,
            data.provider,
            data.providerId ?? null,
            data.visibility,
            data.status,
            data.userId ?? null,
            data.metadata ?? null,
        );

        return this.repository.save(storage);
    }
}
