import { StorageVisibilityEnum } from '../../../enums';

export class UploadFileRequest {
    visibility?: StorageVisibilityEnum;
    metadata?: Record<string, any>;
}
