import { UploadProgressPhaseEnum } from '../enums/upload-progress-phase.enum';
import { UploadProgressTypeEnum } from '../enums/upload-progress-type.enum';

export interface UploadProgressEvent {
    uploadId: string;
    type: UploadProgressTypeEnum;
    phase: UploadProgressPhaseEnum;
    progress: number;
    messageKey: string;
    defaultMessage: string;
    data?: {
        storageId?: string;
        url?: string;
        filename?: string;
        error?: string;
        type?: string;
        r2Progress?: number;
        chunkIndex?: number;
        totalChunks?: number;
    };
}
