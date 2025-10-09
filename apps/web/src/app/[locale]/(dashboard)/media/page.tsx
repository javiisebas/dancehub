'use client';

import { StorageFileViewer, StorageMediaGallery } from '@/features/storage';
import { StorageResponse } from '@repo/shared';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { FileUploadButton } from '@repo/ui/components/file-upload-button';
import { MediaFile } from '@repo/ui/components/media-gallery';
import { Separator } from '@repo/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { FileImage, FileText, FolderOpen } from 'lucide-react';
import { useState } from 'react';

export default function MediaPage() {
    const [selectedFile, setSelectedFile] = useState<StorageResponse | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleFileClick = (file: MediaFile | StorageResponse) => {
        setSelectedFile(file as StorageResponse);
        setViewerOpen(true);
    };

    const handleUploadComplete = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Galería de Medios</h1>
                    <p className="text-muted-foreground">
                        Visualiza y gestiona tus archivos, imágenes y documentos
                    </p>
                </div>
                <FileUploadButton
                    onUploadComplete={handleUploadComplete}
                    maxFiles={10}
                    buttonLabel="Subir Archivos"
                />
            </div>

            <Separator />

            <Tabs defaultValue="all" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="all" className="gap-2">
                        <FolderOpen className="h-4 w-4" />
                        Todos los archivos
                    </TabsTrigger>
                    <TabsTrigger value="images" className="gap-2">
                        <FileImage className="h-4 w-4" />
                        Solo imágenes
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Solo documentos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Todos los Archivos</CardTitle>
                            <CardDescription>
                                Visualiza todos tus archivos subidos. Haz clic en cualquier archivo
                                para verlo en detalle.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StorageMediaGallery
                                key={`all-${refreshKey}`}
                                onFileClick={handleFileClick}
                                allowDelete={true}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Galería de Imágenes</CardTitle>
                            <CardDescription>
                                Explora todas tus imágenes. Haz clic para ver en pantalla completa
                                con zoom.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <FileUploadButton
                                    onUploadComplete={handleUploadComplete}
                                    maxFiles={10}
                                    accept={{
                                        'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                                    }}
                                    buttonLabel="Subir Imágenes"
                                    buttonVariant="outline"
                                    buttonSize="sm"
                                />
                            </div>
                            <StorageMediaGallery
                                key={`images-${refreshKey}`}
                                onFileClick={handleFileClick}
                                allowDelete={true}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documentos</CardTitle>
                            <CardDescription>
                                Visualiza PDFs y otros documentos. El visor incluye navegación,
                                zoom, búsqueda y descarga.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <FileUploadButton
                                    onUploadComplete={handleUploadComplete}
                                    maxFiles={5}
                                    accept={{
                                        'application/pdf': ['.pdf'],
                                        'application/msword': ['.doc'],
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                            ['.docx'],
                                    }}
                                    buttonLabel="Subir Documentos"
                                    buttonVariant="outline"
                                    buttonSize="sm"
                                />
                            </div>
                            <StorageMediaGallery
                                key={`documents-${refreshKey}`}
                                onFileClick={handleFileClick}
                                allowDelete={true}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileImage className="h-5 w-5" />
                            Imágenes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Vista previa instantánea con zoom avanzado. Soporta JPG, PNG, GIF, WebP
                            y más.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            PDFs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Visor completo con navegación, zoom, búsqueda en texto, descarga e
                            impresión.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FolderOpen className="h-5 w-5" />
                            Videos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Reproductor integrado con controles completos. Soporta MP4, WebM y otros
                            formatos.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <StorageFileViewer file={selectedFile} open={viewerOpen} onOpenChange={setViewerOpen} />
        </div>
    );
}
