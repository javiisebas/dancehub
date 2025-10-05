import { BaseResponse } from '../../common/response';
import { StorageProviderEnum, StorageStatusEnum, StorageVisibilityEnum } from '../../../enums';

export class StorageResponse extends BaseResponse {
    filename!: string;
    originalName!: string;
    mimeType!: string;
    extension!: string;
    size!: number;
    path!: string;
    provider!: StorageProviderEnum;
    providerId?: string | null;
    visibility!: StorageVisibilityEnum;
    status!: StorageStatusEnum;
    userId?: string | null;
    metadata?: Record<string, any> | null;
    url?: string;
}
