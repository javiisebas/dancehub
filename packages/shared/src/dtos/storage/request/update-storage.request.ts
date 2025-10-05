import { StorageStatusEnum, StorageVisibilityEnum } from '../../../enums';

export class UpdateStorageRequest {
    filename?: string;
    visibility?: StorageVisibilityEnum;
    status?: StorageStatusEnum;
    metadata?: Record<string, any> | null;
}
