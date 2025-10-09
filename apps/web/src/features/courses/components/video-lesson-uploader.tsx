'use client';

import { Icon } from '@iconify/react';
import type { UploadFileResponse } from '@repo/shared';
import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { Progress } from '@repo/ui/components/progress';
import { useVideoUpload } from '@web/features/storage/hooks/use-video-upload.hook';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function cn(...inputs: (string | undefined | null | boolean)[]) {
    return inputs.filter(Boolean).join(' ');
}

interface VideoLessonUploaderProps {
    lessonId?: string;
    courseId?: string;
    onUploadComplete?: (video: UploadFileResponse) => void;
    className?: string;
    maxSize?: number;
}

export function VideoLessonUploader({
    lessonId,
    courseId,
    onUploadComplete,
    className,
    maxSize = 1000 * 1024 * 1024,
}: VideoLessonUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadSpeed, setUploadSpeed] = useState<string>('');
    const [estimatedTime, setEstimatedTime] = useState<string>('');
    const startTimeRef = useRef<number>(0);
    const lastProgressRef = useRef({ time: 0, bytes: 0 });

    const formatFileSize = useCallback((bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    }, []);

    const formatSpeed = useCallback(
        (bytesPerSecond: number): string => {
            return `${formatFileSize(bytesPerSecond)}/s`;
        },
        [formatFileSize],
    );

    const formatTime = useCallback((seconds: number): string => {
        if (!isFinite(seconds) || seconds <= 0) return 'Calculando...';
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    }, []);

    const formatDuration = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const { uploadVideo, isUploading, progress, error, result, reset } = useVideoUpload({
        metadata: {
            lessonId: lessonId || '',
            courseId: courseId || '',
            type: 'lesson-video',
        },
        onSuccess: (uploadResult) => {
            if (onUploadComplete) {
                onUploadComplete(uploadResult);
            }
        },
        onError: (uploadError) => {
            console.error('Video upload failed:', uploadError);
        },
    });

    useEffect(() => {
        if (!progress || !selectedFile || progress.phase !== 'uploading') return;

        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        const currentBytes = (selectedFile.size * progress.percentage) / 100;

        if (lastProgressRef.current.time > 0 && elapsed > 1000) {
            const timeDiff = elapsed - lastProgressRef.current.time;
            const bytesDiff = currentBytes - lastProgressRef.current.bytes;

            if (timeDiff > 0 && bytesDiff > 0) {
                const speed = (bytesDiff / timeDiff) * 1000;
                setUploadSpeed(formatSpeed(speed));

                const remainingBytes = selectedFile.size - currentBytes;
                const remainingTime = remainingBytes / speed;
                setEstimatedTime(formatTime(remainingTime));
            }
        }

        lastProgressRef.current = { time: elapsed, bytes: currentBytes };
    }, [progress, selectedFile, formatSpeed, formatTime]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > maxSize) {
                console.error(`File too large: ${formatFileSize(file.size)}`);
                return;
            }
            setSelectedFile(file);
            setUploadSpeed('');
            setEstimatedTime('');
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            if (file.size > maxSize) {
                console.error(`File too large: ${formatFileSize(file.size)}`);
                return;
            }

            setSelectedFile(file);
            setUploadSpeed('');
            setEstimatedTime('');
        },
        [maxSize, formatFileSize],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'video/*': ['.mp4', '.webm', '.mov', '.avi'],
        },
        multiple: false,
        maxSize,
        disabled: isUploading,
    });

    const handleUpload = async () => {
        if (!selectedFile) return;

        startTimeRef.current = Date.now();
        lastProgressRef.current = { time: 0, bytes: 0 };

        try {
            await uploadVideo(selectedFile);
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    const handleSelectClick = () => {
        fileInputRef.current?.click();
    };

    const handleReset = () => {
        setSelectedFile(null);
        setUploadSpeed('');
        setEstimatedTime('');
        startTimeRef.current = 0;
        lastProgressRef.current = { time: 0, bytes: 0 };
        reset();
    };

    return (
        <Card className={cn('w-full', className)}>
            <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                    <Icon icon="mdi:video-plus" className="w-5 h-5" />
                    Upload Lesson Video
                </CardTitle>
                <CardDescription>
                    Upload a video for this lesson. Supported formats: MP4, WebM, MOV (max 100MB)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {!selectedFile && !result && (
                    <div
                        {...getRootProps()}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-all ${
                            isDragActive
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary hover:bg-primary/5'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <Icon
                            icon="mdi:cloud-upload"
                            className={`mb-4 h-12 w-12 ${
                                isDragActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                        />
                        <p className="mb-1 text-sm font-medium">
                            {isDragActive ? 'Drop video here' : 'Drag & drop or click to select'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            MP4, WebM, MOV (max {formatFileSize(maxSize)})
                        </p>
                    </div>
                )}

                {selectedFile && !result && (
                    <div className="space-y-4">
                        <div className="flex gap-3 items-center p-4 rounded-lg border bg-muted/50">
                            <Icon icon="mdi:video" className="w-8 h-8 text-primary" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                            {!isUploading && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <Icon icon="mdi:close" className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {isUploading && progress && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-2 h-2 rounded-full animate-pulse bg-primary" />
                                        <span className="font-medium text-primary">
                                            {progress.phase === 'uploading'
                                                ? 'Subiendo al servidor'
                                                : progress.message || 'Procesando video'}
                                        </span>
                                    </div>
                                    <span className="font-semibold tabular-nums">
                                        {progress.percentage}%
                                    </span>
                                </div>
                                <Progress value={progress.percentage} className="h-2" />
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground">
                                        {progress.phase === 'uploading' ? (
                                            <>
                                                {formatFileSize(progress.loaded)} /{' '}
                                                {formatFileSize(progress.total)}
                                            </>
                                        ) : progress.message?.includes('R2') ? (
                                            'Subiendo a almacenamiento...'
                                        ) : (
                                            'Extrayendo metadata y generando thumbnails...'
                                        )}
                                    </span>
                                    {uploadSpeed && progress.phase === 'uploading' && (
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-1.5">
                                                <Icon
                                                    icon="mdi:speedometer"
                                                    className="h-3.5 w-3.5 text-primary"
                                                />
                                                <span className="font-medium tabular-nums">
                                                    {uploadSpeed}
                                                </span>
                                            </div>
                                            {estimatedTime && (
                                                <div className="flex items-center gap-1.5">
                                                    <Icon
                                                        icon="mdi:clock-outline"
                                                        className="h-3.5 w-3.5 text-primary"
                                                    />
                                                    <span className="font-medium tabular-nums">
                                                        {estimatedTime}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex gap-2 items-center p-3 rounded-lg bg-destructive/10 text-destructive">
                                <Icon icon="mdi:alert-circle" className="w-5 h-5" />
                                <p className="text-sm">{error.message}</p>
                            </div>
                        )}

                        {!isUploading && (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="flex-1"
                                >
                                    <Icon icon="mdi:upload" className="mr-2 w-4 h-4" />
                                    Upload Video
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleSelectClick}
                                    disabled={isUploading}
                                >
                                    Change
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {result && (
                    <div className="space-y-4">
                        <div className="flex gap-3 items-center p-4 rounded-lg border border-primary/20 bg-primary/5">
                            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-primary/10">
                                <Icon icon="mdi:check" className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">Upload Complete!</p>
                                <p className="text-xs truncate text-muted-foreground">
                                    {result.originalName}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/50">
                            <div>
                                <p className="mb-1 text-xs text-muted-foreground">Size</p>
                                <p className="text-sm font-medium">{formatFileSize(result.size)}</p>
                            </div>
                            <div>
                                <p className="mb-1 text-xs text-muted-foreground">Format</p>
                                <p className="text-sm font-medium uppercase">{result.extension}</p>
                            </div>
                            {result.metadata?.duration && (
                                <>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Duration
                                        </p>
                                        <p className="text-sm font-medium">
                                            {formatDuration(
                                                Math.round(result.metadata.duration as number),
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-muted-foreground">
                                            Resolution
                                        </p>
                                        <p className="text-sm font-medium">
                                            {result.metadata.width}x{result.metadata.height}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <Button variant="outline" onClick={handleReset} className="w-full">
                            <Icon icon="mdi:upload" className="mr-2 w-4 h-4" />
                            Subir Otro Video
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
