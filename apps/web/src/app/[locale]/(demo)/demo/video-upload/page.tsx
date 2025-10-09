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
import { Separator } from '@repo/ui/components/separator';
import { VideoLessonUploader } from '@web/features/courses/components/video-lesson-uploader';
import { videoService } from '@web/features/storage/api/video.service';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

const VideoPlayer = dynamic(
    () => import('@repo/ui/components/client-only').then((m) => m.VideoPlayer),
    {
        ssr: false,
    },
);

export default function VideoUploadDemoPage() {
    const [uploadedVideo, setUploadedVideo] = useState<UploadFileResponse | null>(null);
    const [streamingUrl, setStreamingUrl] = useState<string | null>(null);
    const [loadingUrl, setLoadingUrl] = useState(false);
    const [urlError, setUrlError] = useState<string | null>(null);

    const handleUploadComplete = async (video: UploadFileResponse) => {
        setUploadedVideo(video);
        setStreamingUrl(null);
        setUrlError(null);
    };

    const handleGetStreamingUrl = async () => {
        if (!uploadedVideo) return;

        try {
            setLoadingUrl(true);
            setUrlError(null);
            const response = await videoService.getStreamingUrl(uploadedVideo.id, 7200);
            setStreamingUrl(response.url);
        } catch (error) {
            console.error('Failed to get streaming URL:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'No se pudo obtener la URL de streaming';
            setUrlError(errorMessage);
        } finally {
            setLoadingUrl(false);
        }
    };

    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Link href="/demo">
                        <Button variant="ghost" size="sm">
                            ← Volver
                        </Button>
                    </Link>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Video Upload & Streaming</h1>
                <p className="text-xl text-muted-foreground">
                    Sistema completo de carga y reproducción de videos con R2
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                    {!uploadedVideo && (
                        <VideoLessonUploader
                            lessonId="demo-lesson"
                            courseId="demo-course"
                            onUploadComplete={handleUploadComplete}
                        />
                    )}

                    {uploadedVideo && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Video Information</CardTitle>
                                <CardDescription>Detalles del video subido</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">ID:</span>
                                        <span className="font-mono text-xs">
                                            {uploadedVideo.id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Filename:</span>
                                        <span className="font-medium">
                                            {uploadedVideo.filename}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Original:</span>
                                        <span className="font-medium">
                                            {uploadedVideo.originalName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">MIME Type:</span>
                                        <span className="font-medium">
                                            {uploadedVideo.mimeType}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Provider:</span>
                                        <span className="font-medium uppercase">
                                            {uploadedVideo.provider}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Visibility:</span>
                                        <span className="font-medium capitalize">
                                            {uploadedVideo.visibility}
                                        </span>
                                    </div>
                                    {uploadedVideo.metadata && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Duration:
                                                </span>
                                                <span className="font-medium">
                                                    {uploadedVideo.metadata.duration
                                                        ? `${Math.round(uploadedVideo.metadata.duration as number)}s`
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Resolution:
                                                </span>
                                                <span className="font-medium">
                                                    {uploadedVideo.metadata.width &&
                                                    uploadedVideo.metadata.height
                                                        ? `${uploadedVideo.metadata.width}x${uploadedVideo.metadata.height}`
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setUploadedVideo(null);
                                            setStreamingUrl(null);
                                            setUrlError(null);
                                        }}
                                        className="flex-1"
                                    >
                                        <Icon icon="mdi:upload" className="mr-2 h-4 w-4" />
                                        Subir Otro Video
                                    </Button>
                                </div>

                                <Separator />

                                <Button
                                    onClick={handleGetStreamingUrl}
                                    loading={loadingUrl}
                                    disabled={loadingUrl || !!streamingUrl}
                                    className="w-full"
                                >
                                    {loadingUrl ? (
                                        'Obteniendo URL...'
                                    ) : streamingUrl ? (
                                        <>
                                            <Icon icon="mdi:check" className="mr-2 h-4 w-4" />
                                            URL Obtenida
                                        </>
                                    ) : (
                                        <>
                                            <Icon icon="mdi:play-circle" className="mr-2 h-4 w-4" />
                                            Obtener URL de Streaming
                                        </>
                                    )}
                                </Button>

                                {urlError && (
                                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                                        <Icon
                                            icon="mdi:alert-circle"
                                            className="h-5 w-5 flex-shrink-0"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Error al obtener URL
                                            </p>
                                            <p className="text-xs">{urlError}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setUrlError(null);
                                                handleGetStreamingUrl();
                                            }}
                                        >
                                            Reintentar
                                        </Button>
                                    </div>
                                )}

                                {streamingUrl && (
                                    <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium text-primary">
                                                Streaming URL obtenida
                                            </p>
                                            <Icon
                                                icon="mdi:check-circle"
                                                className="h-4 w-4 text-primary"
                                            />
                                        </div>
                                        <p className="break-all font-mono text-xs text-muted-foreground">
                                            {streamingUrl.substring(0, 80)}...
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Válida por 2 horas
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="transition-all duration-300">
                        {streamingUrl && uploadedVideo ? (
                            <Card className="duration-500 animate-in fade-in slide-in-from-bottom-4">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Icon
                                            icon="mdi:play-circle"
                                            className="h-5 w-5 text-primary"
                                        />
                                        Video Player
                                    </CardTitle>
                                    <CardDescription>Reproduciendo desde R2</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {streamingUrl && (
                                        <div className="overflow-hidden rounded-lg border bg-black">
                                            <VideoPlayer
                                                key={`video-${uploadedVideo.id}-${streamingUrl.substring(0, 20)}`}
                                                sources={{
                                                    src: streamingUrl,
                                                    type: uploadedVideo.mimeType,
                                                }}
                                                poster={uploadedVideo.thumbnails?.[0]?.url}
                                                autoplay={false}
                                                muted={false}
                                                controls={true}
                                                onError={(error) => {
                                                    console.error('Video player error:', error);
                                                }}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed transition-all duration-300">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Icon
                                        icon="mdi:video-off"
                                        className="mb-4 h-16 w-16 text-muted-foreground/50 transition-all duration-300"
                                    />
                                    <p className="text-center text-sm text-muted-foreground">
                                        {uploadedVideo
                                            ? 'Obtén la URL de streaming para reproducir el video aquí'
                                            : 'Sube un video para comenzar'}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Características del Sistema</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Cloudflare R2 Storage</p>
                                    <p className="text-xs text-muted-foreground">
                                        Almacenamiento optimizado sin costos de egreso
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Video Optimization</p>
                                    <p className="text-xs text-muted-foreground">
                                        Compresión automática y transcoding a MP4
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Progressive Streaming</p>
                                    <p className="text-xs text-muted-foreground">
                                        Reproducción inmediata sin esperar descarga completa
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Chunked Upload</p>
                                    <p className="text-xs text-muted-foreground">
                                        Subida en fragmentos con progreso detallado
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Smart Buffering</p>
                                    <p className="text-xs text-muted-foreground">
                                        Indicadores visuales de buffering y carga
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Presigned URLs</p>
                                    <p className="text-xs text-muted-foreground">
                                        Acceso seguro con URLs temporales (2h)
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Thumbnail Generation</p>
                                    <p className="text-xs text-muted-foreground">
                                        Generación automática de miniaturas
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <Icon icon="mdi:check" className="h-3 w-3 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Metadata Extraction</p>
                                    <p className="text-xs text-muted-foreground">
                                        Duración, resolución, codec, bitrate, FPS
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Mejoras Implementadas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:check-circle" className="h-4 w-4 text-green-500" />
                                <span className="text-foreground">
                                    Subida multipart con progreso en tiempo real
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:check-circle" className="h-4 w-4 text-green-500" />
                                <span className="text-foreground">
                                    Estimación de velocidad y tiempo restante
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:check-circle" className="h-4 w-4 text-green-500" />
                                <span className="text-foreground">
                                    Streaming progresivo con range requests
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:check-circle" className="h-4 w-4 text-green-500" />
                                <span className="text-foreground">
                                    Indicadores visuales de buffering
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:check-circle" className="h-4 w-4 text-green-500" />
                                <span className="text-foreground">Drag & drop mejorado</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
