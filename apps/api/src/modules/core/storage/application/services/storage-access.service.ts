import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Storage } from '../../domain/entities/storage.entity';
import {
    IStorageRepository,
    STORAGE_REPOSITORY,
} from '../../domain/repositories/i-storage.repository';

/**
 * Service responsible for access control logic
 * Centralized security checks for storage operations
 */
@Injectable()
export class StorageAccessService {
    constructor(@Inject(STORAGE_REPOSITORY) private readonly repository: IStorageRepository) {}

    /**
     * Get storage and verify it exists
     */
    async getStorageOrFail(storageId: string): Promise<Storage> {
        const storage = await this.repository.findById(storageId);
        if (!storage) {
            throw new NotFoundException(`Storage with id ${storageId} not found`);
        }
        return storage;
    }

    /**
     * Verify user has read access to storage
     */
    verifyReadAccess(storage: Storage, userId: string | null): void {
        if (!storage.canBeAccessedBy(userId)) {
            throw new ForbiddenException('You do not have permission to access this file');
        }
    }

    /**
     * Verify user has write access to storage
     */
    verifyWriteAccess(storage: Storage, userId: string | null): void {
        if (!userId) {
            throw new ForbiddenException('Authentication required');
        }

        if (!storage.belongsToUser(userId)) {
            throw new ForbiddenException('You do not have permission to modify this file');
        }
    }

    /**
     * Verify user has delete access to storage
     */
    verifyDeleteAccess(storage: Storage, userId: string | null): void {
        if (!userId) {
            throw new ForbiddenException('Authentication required');
        }

        if (!storage.belongsToUser(userId)) {
            throw new ForbiddenException('You do not have permission to delete this file');
        }
    }

    /**
     * Verify storage is publicly accessible
     */
    verifyPublicAccess(storage: Storage): void {
        if (!storage.isPublic()) {
            throw new ForbiddenException('This file is not publicly accessible');
        }
    }

    /**
     * Check if user can access storage (boolean, no throw)
     */
    canUserAccess(storage: Storage, userId: string | null): boolean {
        return storage.canBeAccessedBy(userId);
    }

    /**
     * Check if user owns storage (boolean, no throw)
     */
    doesUserOwn(storage: Storage, userId: string | null): boolean {
        return userId !== null && storage.belongsToUser(userId);
    }
}
