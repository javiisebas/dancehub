'use client';

import {
    ChevronLeft,
    ChevronRight,
    FileIcon,
    Grid3x3,
    ImageIcon,
    List,
    Search,
    Trash2,
    Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Skeleton } from './skeleton';

export interface MediaFile {
    id: string;
    url: string;
    originalName: string;
    filename: string;
    mimeType: string;
    size: number;
    extension: string;
    visibility?: 'public' | 'private';
}

export interface MediaGalleryProps {
    files: MediaFile[];
    isLoading?: boolean;
    onFileClick?: (file: MediaFile) => void;
    onDelete?: (fileId: string) => void;
    allowDelete?: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    };
    className?: string;
}

export function MediaGallery({
    files = [],
    isLoading = false,
    onFileClick,
    onDelete,
    allowDelete = false,
    pagination,
    className,
}: MediaGalleryProps) {
    const [search, setSearch] = useState('');
    const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredFiles = useMemo(() => {
        let filtered = files;

        if (search) {
            filtered = filtered.filter(
                (file) =>
                    file.originalName.toLowerCase().includes(search.toLowerCase()) ||
                    file.filename.toLowerCase().includes(search.toLowerCase()),
            );
        }

        if (fileTypeFilter !== 'all') {
            filtered = filtered.filter((file) => {
                if (fileTypeFilter === 'image') return file.mimeType.startsWith('image/');
                if (fileTypeFilter === 'video') return file.mimeType.startsWith('video/');
                if (fileTypeFilter === 'document')
                    return (
                        file.mimeType.includes('pdf') ||
                        file.mimeType.includes('document') ||
                        file.mimeType.includes('word') ||
                        file.mimeType.includes('excel') ||
                        file.mimeType.includes('powerpoint')
                    );
                return true;
            });
        }

        return filtered;
    }, [files, search, fileTypeFilter]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
        if (mimeType.startsWith('video/')) return <Video className="h-5 w-5" />;
        return <FileIcon className="h-5 w-5" />;
    };

    if (isLoading) {
        return (
            <div className={className}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search files..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="image">Images</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
                            <SelectItem value="document">Documents</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Empty State */}
            {filteredFiles.length === 0 ? (
                <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center">
                        <FileIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">No files found</p>
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                // Grid View
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredFiles.map((file) => (
                        <Card
                            key={file.id}
                            className="group overflow-hidden transition-all hover:shadow-lg"
                        >
                            <CardContent className="p-0">
                                <div
                                    className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
                                    onClick={() => onFileClick?.(file)}
                                >
                                    {file.mimeType.startsWith('image/') ? (
                                        <Zoom>
                                            <img
                                                src={file.url}
                                                alt={file.originalName}
                                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        </Zoom>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            {getFileIcon(file.mimeType)}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                        <p className="truncate text-sm font-medium">
                                            {file.originalName}
                                        </p>
                                        <p className="text-xs text-white/80">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {file.extension}
                                        </Badge>
                                        {file.visibility && (
                                            <Badge
                                                variant={
                                                    file.visibility === 'public'
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className="text-xs"
                                            >
                                                {file.visibility}
                                            </Badge>
                                        )}
                                    </div>
                                    {allowDelete && onDelete && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(file.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                // List View
                <div className="space-y-2">
                    {filteredFiles.map((file) => (
                        <Card
                            key={file.id}
                            className="cursor-pointer transition-all hover:shadow-md"
                            onClick={() => onFileClick?.(file)}
                        >
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        {getFileIcon(file.mimeType)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{file.originalName}</p>
                                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{formatFileSize(file.size)}</span>
                                            <span>•</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {file.extension}
                                            </Badge>
                                            {file.visibility && (
                                                <>
                                                    <span>•</span>
                                                    <Badge
                                                        variant={
                                                            file.visibility === 'public'
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {file.visibility}
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {allowDelete && onDelete && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(file.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
