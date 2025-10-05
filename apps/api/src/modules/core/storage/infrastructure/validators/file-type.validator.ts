import { STORAGE_CONSTANTS } from '../../application/constants/storage.constants';

export class FileTypeValidator {
    static readonly IMAGE_MIME_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ];

    static readonly DOCUMENT_MIME_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
    ];

    static readonly VIDEO_MIME_TYPES = [
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm',
    ];

    static readonly AUDIO_MIME_TYPES = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/ogg',
        'audio/webm',
    ];

    static readonly IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    static readonly DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'];
    static readonly VIDEO_EXTENSIONS = ['mp4', 'mpeg', 'mov', 'avi', 'webm'];
    static readonly AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'webm'];

    static isImage(mimeType: string): boolean {
        return this.IMAGE_MIME_TYPES.includes(mimeType);
    }

    static isDocument(mimeType: string): boolean {
        return this.DOCUMENT_MIME_TYPES.includes(mimeType);
    }

    static isVideo(mimeType: string): boolean {
        return this.VIDEO_MIME_TYPES.includes(mimeType);
    }

    static isAudio(mimeType: string): boolean {
        return this.AUDIO_MIME_TYPES.includes(mimeType);
    }

    static getMaxSizeForType(mimeType: string): number {
        if (this.isImage(mimeType)) {
            return STORAGE_CONSTANTS.FILE_SIZE_LIMITS.IMAGE;
        }
        if (this.isDocument(mimeType)) {
            return STORAGE_CONSTANTS.FILE_SIZE_LIMITS.DOCUMENT;
        }
        if (this.isVideo(mimeType)) {
            return STORAGE_CONSTANTS.FILE_SIZE_LIMITS.VIDEO;
        }
        if (this.isAudio(mimeType)) {
            return STORAGE_CONSTANTS.FILE_SIZE_LIMITS.AUDIO;
        }
        return STORAGE_CONSTANTS.FILE_SIZE_LIMITS.DEFAULT;
    }
}
