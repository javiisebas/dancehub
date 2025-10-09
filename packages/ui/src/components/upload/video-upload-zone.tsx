'use client';

import { Accept } from 'react-dropzone';
import { FileUploadZone, FileUploadZoneProps } from './file-upload-zone';

export interface VideoUploadZoneProps extends Omit<FileUploadZoneProps, 'accept'> {
    acceptedFormats?: string[];
}

const DEFAULT_VIDEO_FORMATS = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];

export function VideoUploadZone({
    acceptedFormats = DEFAULT_VIDEO_FORMATS,
    maxSize = 500 * 1024 * 1024,
    ...props
}: VideoUploadZoneProps) {
    const accept: Accept = {
        'video/*': acceptedFormats,
    };

    return <FileUploadZone {...props} accept={accept} maxSize={maxSize} />;
}
