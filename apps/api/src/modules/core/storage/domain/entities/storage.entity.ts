import { BaseEntity } from '@api/common/abstract/domain';
import { StorageProviderEnum, StorageStatusEnum, StorageVisibilityEnum } from '@repo/shared';

export class Storage extends BaseEntity {
    constructor(
        id: string,
        public filename: string,
        public originalName: string,
        public mimeType: string,
        public extension: string,
        public size: number,
        public path: string,
        public provider: StorageProviderEnum,
        public providerId: string | null,
        public visibility: StorageVisibilityEnum,
        public status: StorageStatusEnum,
        public userId: string | null,
        public metadata: Record<string, any> | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    isPublic(): boolean {
        return this.visibility === StorageVisibilityEnum.PUBLIC;
    }

    isPrivate(): boolean {
        return this.visibility === StorageVisibilityEnum.PRIVATE;
    }

    requiresAuthentication(): boolean {
        return this.visibility === StorageVisibilityEnum.AUTHENTICATED;
    }

    isActive(): boolean {
        return this.status === StorageStatusEnum.ACTIVE;
    }

    isDeleted(): boolean {
        return this.status === StorageStatusEnum.DELETED;
    }

    belongsToUser(userId: string): boolean {
        return this.userId === userId;
    }

    canBeAccessedBy(userId: string | null): boolean {
        if (this.isPublic()) {
            return true;
        }

        if (this.requiresAuthentication() && userId) {
            return true;
        }

        if (this.isPrivate() && userId && this.belongsToUser(userId)) {
            return true;
        }

        return false;
    }

    updateStatus(status: StorageStatusEnum): void {
        this.status = status;
    }

    updateVisibility(visibility: StorageVisibilityEnum): void {
        this.visibility = visibility;
    }

    updateMetadata(metadata: Record<string, any> | null): void {
        this.metadata = metadata;
    }

    markAsDeleted(): void {
        this.status = StorageStatusEnum.DELETED;
    }

    static create(
        id: string,
        filename: string,
        originalName: string,
        mimeType: string,
        extension: string,
        size: number,
        path: string,
        provider: StorageProviderEnum,
        providerId: string | null,
        visibility: StorageVisibilityEnum,
        status: StorageStatusEnum,
        userId: string | null,
        metadata: Record<string, any> | null = null,
    ): Storage {
        const now = new Date();
        return new Storage(
            id,
            filename,
            originalName,
            mimeType,
            extension,
            size,
            path,
            provider,
            providerId,
            visibility,
            status,
            userId,
            metadata,
            now,
            now,
        );
    }
}
