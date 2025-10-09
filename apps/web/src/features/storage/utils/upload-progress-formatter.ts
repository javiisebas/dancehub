import { UploadProgressEvent, UploadProgressPhaseEnum } from '@repo/shared';

export interface FormattedProgress {
    title: string;
    subtitle: string;
    progress: number;
}

export function formatUploadProgress(event: UploadProgressEvent): FormattedProgress {
    const { phase, progress, defaultMessage, data } = event;

    let title = defaultMessage;
    let subtitle = `${progress}%`;

    switch (phase) {
        case UploadProgressPhaseEnum.SERVER_UPLOAD:
            title = 'Uploading to server...';
            subtitle = `${progress}%`;
            break;

        case UploadProgressPhaseEnum.METADATA_EXTRACTION:
            title = 'Processing file...';
            subtitle = `${progress}%`;
            break;

        case UploadProgressPhaseEnum.R2_UPLOAD:
            title = 'Uploading to cloud storage...';
            if (data?.r2Progress !== undefined) {
                subtitle = `${data.r2Progress}% (${progress}% overall)`;
            } else {
                subtitle = `${progress}%`;
            }
            break;

        case UploadProgressPhaseEnum.THUMBNAIL_GENERATION:
            title = 'Generating thumbnails...';
            subtitle = `${progress}%`;
            break;

        case UploadProgressPhaseEnum.COMPLETE:
            title = 'Upload complete!';
            subtitle = '100%';
            break;

        default:
            title = defaultMessage;
            subtitle = `${progress}%`;
    }

    return {
        title,
        subtitle,
        progress,
    };
}

export const UPLOAD_PROGRESS_MESSAGES: Record<string, string> = {
    'upload.starting': 'Starting upload...',
    'upload.uploading_server': 'Uploading to server...',
    'upload.processing.image': 'Processing image...',
    'upload.processing.video': 'Processing video...',
    'upload.processing': 'Processing file...',
    'upload.cloud_storage': 'Uploading to cloud storage...',
    'upload.generating_thumbnails': 'Generating thumbnails...',
    'upload.complete': 'Upload complete!',
    'upload.error': 'Upload failed',
};

export function getUploadMessage(messageKey: string, defaultMessage: string): string {
    return UPLOAD_PROGRESS_MESSAGES[messageKey] || defaultMessage;
}

