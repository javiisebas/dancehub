import { StorageProviderEnum, StorageStatusEnum, StorageVisibilityEnum } from '../../../enums';
import { BaseResponse } from '../../common/response';

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
