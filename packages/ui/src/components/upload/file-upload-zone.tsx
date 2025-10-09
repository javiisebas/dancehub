'use client';

import { AlertCircle, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Accept, FileRejection } from 'react-dropzone';
import { cn } from '../../utils/cn';
import { Button } from '../button';
import { FileDropzone } from './file-dropzone';
import { FileItem, FileList } from './file-list';

export interface FileUploadZoneProps {
    files?: FileItem[];
    onFilesSelected?: (files: File[]) => void;
    onFileRemove?: (fileId: string) => void;
    maxFiles?: number;
    maxSize?: number;
    accept?: Accept;
    multiple?: boolean;
    disabled?: boolean;
    showPreview?: boolean;
    className?: string;
    variant?: 'default' | 'compact';
    dropzoneVariant?: 'default' | 'compact' | 'minimal';
}

export function FileUploadZone({
    files = [],
    onFilesSelected,
    onFileRemove,
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    accept,
    multiple = true,
    disabled = false,
    showPreview = true,
    className,
    variant = 'default',
    dropzoneVariant,
}: FileUploadZoneProps) {
    const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

    const handleFilesAccepted = useCallback(
        (acceptedFiles: File[]) => {
            setRejectedFiles([]);
            onFilesSelected?.(acceptedFiles);
        },
        [onFilesSelected],
    );

    const handleFilesRejected = useCallback((fileRejections: FileRejection[]) => {
        setRejectedFiles(fileRejections);
    }, []);

    const handleDismissErrors = useCallback(() => {
        setRejectedFiles([]);
    }, []);

    return (
        <div className={cn('w-full space-y-4', className)}>
            <FileDropzone
                onFilesAccepted={handleFilesAccepted}
                onFilesRejected={handleFilesRejected}
                maxFiles={maxFiles}
                maxSize={maxSize}
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                variant={dropzoneVariant || (variant === 'compact' ? 'compact' : 'default')}
            />

            {rejectedFiles.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                        <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-destructive">
                                        {rejectedFiles.length} file
                                        {rejectedFiles.length > 1 ? 's' : ''} rejected
                                    </p>
                                    <p className="text-xs text-destructive/80 mt-0.5">
                                        Please check the requirements and try again
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={handleDismissErrors}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <ul className="space-y-1.5 border-t border-destructive/20 pt-2">
                                {rejectedFiles.map((rejection, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs">
                                        <span className="font-medium text-destructive/90">
                                            {rejection.file.name}:
                                        </span>
                                        <span className="text-destructive/70">
                                            {rejection.errors.map((e) => e.message).join(', ')}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {files.length > 0 && (
                <FileList
                    files={files}
                    onRemove={onFileRemove}
                    showPreview={showPreview}
                    variant={variant}
                />
            )}
        </div>
    );
}
