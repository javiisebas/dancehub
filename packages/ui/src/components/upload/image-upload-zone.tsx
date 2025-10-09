'use client';

import { Accept } from 'react-dropzone';
import { FileUploadZone, FileUploadZoneProps } from './file-upload-zone';

export interface ImageUploadZoneProps extends Omit<FileUploadZoneProps, 'accept'> {
    acceptedFormats?: string[];
}

const DEFAULT_IMAGE_FORMATS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

export function ImageUploadZone({
    acceptedFormats = DEFAULT_IMAGE_FORMATS,
    maxSize = 10 * 1024 * 1024,
    showPreview = true,
    ...props
}: ImageUploadZoneProps) {
    const accept: Accept = {
        'image/*': acceptedFormats,
    };

    return (
        <FileUploadZone {...props} accept={accept} maxSize={maxSize} showPreview={showPreview} />
    );
}
