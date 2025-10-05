import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import type { StorageField } from '@repo/shared';
import type { Storage } from '../entities/storage.entity';

export const STORAGE_REPOSITORY = Symbol('STORAGE_REPOSITORY');

export interface IStorageRepository extends IBaseRepository<Storage, StorageField> {
    findByUserId(userId: string): Promise<Storage[]>;
    findByPath(path: string): Promise<Storage | null>;
}
