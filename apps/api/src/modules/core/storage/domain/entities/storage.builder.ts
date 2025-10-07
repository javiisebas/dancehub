import { StorageProviderEnum, StorageStatusEnum, StorageVisibilityEnum } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Storage } from './storage.entity';

/**
 * Builder for creating Storage entities with a fluent API
 * Provides better DX and type safety than 15-parameter constructor
 */
export class StorageBuilder {
    private id: string = randomUUID();
    private filename!: string;
    private originalName!: string;
    private mimeType!: string;
    private extension!: string;
    private size!: number;
    private path!: string;
    private provider: StorageProviderEnum = StorageProviderEnum.R2;
    private providerId: string | null = null;
    private visibility: StorageVisibilityEnum = StorageVisibilityEnum.PRIVATE;
    private status: StorageStatusEnum = StorageStatusEnum.UPLOADING;
    private userId: string | null = null;
    private metadata: Record<string, any> | null = null;

    static create(): StorageBuilder {
        return new StorageBuilder();
    }

    withId(id: string): this {
        this.id = id;
        return this;
    }

    withFile(file: {
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
    }): this {
        this.filename = file.filename;
        this.originalName = file.originalName;
        this.mimeType = file.mimeType;
        this.size = file.size;
        return this;
    }

    withFilename(filename: string): this {
        this.filename = filename;
        return this;
    }

    withOriginalName(originalName: string): this {
        this.originalName = originalName;
        return this;
    }

    withMimeType(mimeType: string): this {
        this.mimeType = mimeType;
        return this;
    }

    withExtension(extension: string): this {
        this.extension = extension;
        return this;
    }

    withSize(size: number): this {
        this.size = size;
        return this;
    }

    withPath(path: string): this {
        this.path = path;
        return this;
    }

    withProvider(provider: StorageProviderEnum, providerId?: string): this {
        this.provider = provider;
        if (providerId) {
            this.providerId = providerId;
        }
        return this;
    }

    withVisibility(visibility: StorageVisibilityEnum): this {
        this.visibility = visibility;
        return this;
    }

    withStatus(status: StorageStatusEnum): this {
        this.status = status;
        return this;
    }

    withUser(userId: string | null): this {
        this.userId = userId;
        return this;
    }

    withMetadata(metadata: Record<string, any> | null): this {
        this.metadata = metadata;
        return this;
    }

    asPublic(): this {
        this.visibility = StorageVisibilityEnum.PUBLIC;
        return this;
    }

    asPrivate(): this {
        this.visibility = StorageVisibilityEnum.PRIVATE;
        return this;
    }

    asAuthenticated(): this {
        this.visibility = StorageVisibilityEnum.AUTHENTICATED;
        return this;
    }

    asActive(): this {
        this.status = StorageStatusEnum.ACTIVE;
        return this;
    }

    asFailed(): this {
        this.status = StorageStatusEnum.FAILED;
        return this;
    }

    build(): Storage {
        // Validate required fields
        if (!this.filename) throw new Error('filename is required');
        if (!this.originalName) throw new Error('originalName is required');
        if (!this.mimeType) throw new Error('mimeType is required');
        if (!this.extension) throw new Error('extension is required');
        if (this.size === undefined) throw new Error('size is required');
        if (!this.path) throw new Error('path is required');

        return Storage.create(
            this.id,
            this.filename,
            this.originalName,
            this.mimeType,
            this.extension,
            this.size,
            this.path,
            this.provider,
            this.providerId,
            this.visibility,
            this.status,
            this.userId,
            this.metadata,
        );
    }
}
