'use client';

import { MediaFile, MediaGallery } from '@repo/ui/components/media-gallery';
import { useCallback, useState } from 'react';
import { useStorageFileDelete } from '../hooks/use-storage-file.hook';
import { useStorageList } from '../hooks/use-storage-list.hook';

export interface StorageMediaGalleryProps {
    allowDelete?: boolean;
    onFileClick?: (file: MediaFile) => void;
    className?: string;
}

export function StorageMediaGallery({
    allowDelete = false,
    onFileClick,
    className,
}: StorageMediaGalleryProps) {
    const [page, setPage] = useState(1);
    const { data, isLoading, refetch } = useStorageList({ page, limit: 20 });
    const { mutate: deleteFile } = useStorageFileDelete();

    const files: MediaFile[] =
        data?.data.map((file) => ({
            id: file.id,
            url: file.url || '',
            originalName: file.originalName,
            filename: file.filename,
            mimeType: file.mimeType,
            size: file.size,
            extension: file.extension,
            visibility: file.visibility as 'public' | 'private',
        })) || [];

    const handleDelete = useCallback(
        (fileId: string) => {
            if (confirm('Are you sure you want to delete this file?')) {
                deleteFile(fileId, {
                    onSuccess: () => refetch(),
                });
            }
        },
        [deleteFile, refetch],
    );

    const totalPages = data?.totalPages ?? 1;

    return (
        <MediaGallery
            files={files}
            isLoading={isLoading}
            onFileClick={onFileClick}
            onDelete={allowDelete ? handleDelete : undefined}
            allowDelete={allowDelete}
            pagination={{
                page,
                totalPages,
                onPageChange: setPage,
            }}
            className={className}
        />
    );
}
