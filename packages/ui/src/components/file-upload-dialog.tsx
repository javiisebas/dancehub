'use client';

import { Accept } from 'react-dropzone';
import { Button } from './button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './dialog';
import { FileUploader, FileUploadItem } from './file-uploader';

export interface FileUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFilesSelected: (files: File[]) => Promise<void> | void;
    onComplete?: () => void;
    onRemoveFile?: (fileId: string) => void;
    title?: string;
    description?: string;
    maxFiles?: number;
    maxSize?: number;
    accept?: Accept;
    multiple?: boolean;
    showPreview?: boolean;
    files?: FileUploadItem[];
    disabled?: boolean;
    isUploading?: boolean;
}

export function FileUploadDialog({
    open,
    onOpenChange,
    onFilesSelected,
    onComplete,
    onRemoveFile,
    title = 'Upload Files',
    description = 'Select files to upload from your device',
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    accept,
    multiple = true,
    showPreview = true,
    files = [],
    disabled = false,
    isUploading = false,
}: FileUploadDialogProps) {
    const handleClose = () => {
        if (!isUploading) {
            onOpenChange(false);
        }
    };

    const allComplete = files.length > 0 && files.every((f) => f.status === 'complete');
    const hasErrors = files.some((f) => f.status === 'error');

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <FileUploader
                    onFilesSelected={onFilesSelected}
                    onFileRemove={onRemoveFile}
                    maxFiles={maxFiles}
                    maxSize={maxSize}
                    accept={accept}
                    multiple={multiple}
                    files={files}
                    disabled={disabled || isUploading}
                    showPreview={showPreview}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        {allComplete ? 'Close' : 'Cancel'}
                    </Button>
                    {allComplete && onComplete && (
                        <Button onClick={onComplete} disabled={hasErrors}>
                            Done
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
