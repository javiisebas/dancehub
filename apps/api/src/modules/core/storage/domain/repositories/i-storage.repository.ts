import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { storages } from '../../infrastructure/schemas/storage.schema';
import type { Storage } from '../entities/storage.entity';

export const STORAGE_REPOSITORY = Symbol('STORAGE_REPOSITORY');

export interface IStorageRepository extends IBaseRepository<Storage, InferFields<typeof storages>> {
    findByUserId(userId: string): Promise<Storage[]>;
    findByPath(path: string): Promise<Storage | null>;
}
