'use client';

import { InlineFileUpload, InlineImageUpload, InlineVideoUpload } from '@/features/storage';
import { StorageVisibilityEnum, UploadFileResponse } from '@repo/shared';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { CheckCircle, File, FileText, Image, Video } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface UploadHistoryItem extends UploadFileResponse {
    historyId: string;
}

export default function FileUploadDemoPage() {
    const [uploadHistory, setUploadHistory] = useState<UploadHistoryItem[]>([]);
    const [activeTab, setActiveTab] = useState('basic');

    const handleUploadComplete = (results: UploadFileResponse[]) => {
        const newItems: UploadHistoryItem[] = results.map((result) => ({
            ...result,
            historyId: `${result.id}-${Date.now()}-${Math.random()}`,
        }));
        setUploadHistory((prev) => [...newItems, ...prev]);
    };

    const clearHistory = () => {
        setUploadHistory([]);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Link href="/demo">
                            <Button variant="ghost" size="sm">
                                ← Volver
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">File Upload Demo</h1>
                    <p className="text-xl text-muted-foreground">
                        Sistema completo de carga de archivos con progreso en tiempo real
                    </p>
                </div>
                {uploadHistory.length > 0 && (
                    <Badge variant="secondary" className="text-base">
                        {uploadHistory.length} archivos subidos
                    </Badge>
                )}
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Básico</TabsTrigger>
                            <TabsTrigger value="images">Imágenes</TabsTrigger>
                            <TabsTrigger value="videos">Videos</TabsTrigger>
                            <TabsTrigger value="documents">Docs</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <File className="h-5 w-5" />
                                        Upload Cualquier Archivo
                                    </CardTitle>
                                    <CardDescription>
                                        Sube cualquier tipo de archivo. Máximo 50MB, hasta 10
                                        archivos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <InlineFileUpload
                                        onFilesUploaded={handleUploadComplete}
                                        maxFiles={10}
                                        maxSize={50 * 1024 * 1024}
                                        multiple={true}
                                        visibility={StorageVisibilityEnum.PRIVATE}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="images" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Image className="h-5 w-5" />
                                        Upload de Imágenes
                                    </CardTitle>
                                    <CardDescription>
                                        Solo imágenes (PNG, JPG, GIF, WebP). Máximo 10MB cada una.
                                        Optimización automática.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <InlineImageUpload
                                        onFilesUploaded={handleUploadComplete}
                                        maxFiles={5}
                                        maxSize={10 * 1024 * 1024}
                                        multiple={true}
                                        visibility={StorageVisibilityEnum.PUBLIC}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Características de Imágenes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Optimización automática con Sharp</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Generación de thumbnails (small, medium, large)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Conversión a WebP para mejor rendimiento</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Vista previa instantánea</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="videos" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Video className="h-5 w-5" />
                                        Upload de Videos
                                    </CardTitle>
                                    <CardDescription>
                                        Videos en MP4, WebM, MOV. Máximo 100MB. Procesamiento
                                        automático.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <InlineVideoUpload
                                        onFilesUploaded={handleUploadComplete}
                                        maxFiles={3}
                                        maxSize={100 * 1024 * 1024}
                                        multiple={true}
                                        visibility={StorageVisibilityEnum.PRIVATE}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/50">
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Características de Videos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Compresión y optimización con FFmpeg</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Generación de thumbnails en frames clave</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>
                                            Extracción de metadata (duración, resolución, codec)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Progreso de procesamiento en tiempo real</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Upload de Documentos
                                    </CardTitle>
                                    <CardDescription>
                                        PDF, Word, Excel, PowerPoint. Máximo 10MB por archivo.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <InlineFileUpload
                                        onFilesUploaded={handleUploadComplete}
                                        maxFiles={5}
                                        maxSize={10 * 1024 * 1024}
                                        accept={{
                                            'application/pdf': ['.pdf'],
                                            'application/msword': ['.doc'],
                                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                                ['.docx'],
                                            'application/vnd.ms-excel': ['.xls'],
                                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                                ['.xlsx'],
                                            'application/vnd.ms-powerpoint': ['.ppt'],
                                            'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                                                ['.pptx'],
                                        }}
                                        multiple={true}
                                        visibility={StorageVisibilityEnum.PRIVATE}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Historial de Uploads</CardTitle>
                                {uploadHistory.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearHistory}>
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                            <CardDescription>Archivos subidos en esta sesión</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {uploadHistory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <File className="mb-2 h-12 w-12 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">
                                        No hay archivos subidos aún
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {uploadHistory.map((file) => (
                                        <div
                                            key={file.historyId}
                                            className="flex items-start gap-3 rounded-lg border p-3"
                                        >
                                            <div className="rounded bg-primary/10 p-2">
                                                {file.mimeType.startsWith('image/') ? (
                                                    <Image className="h-4 w-4 text-primary" />
                                                ) : file.mimeType.startsWith('video/') ? (
                                                    <Video className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <FileText className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {file.originalName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tecnología</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium">Frontend</p>
                                <p className="text-muted-foreground">
                                    React Dropzone + Socket.io + TanStack Query
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Backend</p>
                                <p className="text-muted-foreground">
                                    NestJS + R2 Storage + WebSocket Gateway
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Procesamiento</p>
                                <p className="text-muted-foreground">
                                    Sharp (imágenes) + FFmpeg (videos)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Drag & Drop</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Progreso en tiempo real (WebSocket)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Validación de tipos y tamaños</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Thumbnails automáticos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Múltiples archivos simultáneos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Vista previa inline</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
