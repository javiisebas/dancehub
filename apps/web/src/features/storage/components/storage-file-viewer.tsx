'use client';

import { StorageResponse } from '@repo/shared';
import { FileData, FileViewerDialog } from '@repo/ui/components/file-viewer-dialog';
import { useStorageFileDownload } from '../hooks/use-storage-file.hook';

interface StorageFileViewerProps {
    file: StorageResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StorageFileViewer({ file, open, onOpenChange }: StorageFileViewerProps) {
    const { mutate: downloadFile, isPending: isDownloading } = useStorageFileDownload();

    const handleDownload = () => {
        if (file) {
            downloadFile({ storageId: file.id, filename: file.originalName });
        }
    };

    const fileData: FileData | null = file
        ? {
              id: file.id,
              url: file.url || '',
              originalName: file.originalName,
              mimeType: file.mimeType,
              size: file.size,
              extension: file.extension,
              visibility: file.visibility as 'public' | 'private',
          }
        : null;

    return (
        <FileViewerDialog
            file={fileData}
            open={open}
            onOpenChange={onOpenChange}
            onDownload={handleDownload}
            isDownloading={isDownloading}
        />
    );
}
