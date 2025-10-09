'use client';

import {
    InlineFileUpload,
    InlineImageUpload,
    InlineVideoUpload,
    UploadDebugPanel,
} from '@/features/storage';
import { StorageVisibilityEnum, UploadFileResponse } from '@repo/shared';
import {
    FileDropzone,
    FileItem,
    FileList,
    FileUploadZone,
    ImageUploadZone,
    VideoUploadZone,
} from '@repo/ui/components';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { DataTable } from '@repo/ui/components/data-table';
import { Separator } from '@repo/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    Check,
    FileText,
    Image as ImageIcon,
    Layout,
    Sparkles,
    Table as TableIcon,
    Upload,
    Video as VideoIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';

interface DemoUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    joinedAt: string;
}

const demoData: DemoUser[] = [
    {
        id: '1',
        name: 'Ana García',
        email: 'ana@example.com',
        role: 'Admin',
        status: 'active',
        joinedAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Carlos López',
        email: 'carlos@example.com',
        role: 'Editor',
        status: 'active',
        joinedAt: '2024-02-20',
    },
    {
        id: '3',
        name: 'María Rodríguez',
        email: 'maria@example.com',
        role: 'Viewer',
        status: 'inactive',
        joinedAt: '2024-03-10',
    },
    {
        id: '4',
        name: 'Juan Martínez',
        email: 'juan@example.com',
        role: 'Editor',
        status: 'active',
        joinedAt: '2024-04-05',
    },
    {
        id: '5',
        name: 'Laura Sánchez',
        email: 'laura@example.com',
        role: 'Viewer',
        status: 'active',
        joinedAt: '2024-05-12',
    },
];

export default function ComponentsShowcasePage() {
    const [activeTab, setActiveTab] = useState('tables');
    const [uploadedFiles, setUploadedFiles] = useState<UploadFileResponse[]>([]);
    const [demoFiles, setDemoFiles] = useState<FileItem[]>([]);

    const columns: ColumnDef<DemoUser>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className="-ml-4 h-8"
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ row }) => (
                    <div className="text-muted-foreground">{row.getValue('email')}</div>
                ),
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: ({ row }) => {
                    const role = row.getValue('role') as string;
                    return (
                        <Badge
                            variant={
                                role === 'Admin'
                                    ? 'default'
                                    : role === 'Editor'
                                      ? 'secondary'
                                      : 'outline'
                            }
                        >
                            {role}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.getValue('status') as string;
                    return (
                        <div className="flex items-center gap-2">
                            <div
                                className={`h-2 w-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}
                            />
                            <span className="capitalize">{status}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'joinedAt',
                header: 'Joined',
                cell: ({ row }) => {
                    const date = new Date(row.getValue('joinedAt'));
                    return <div className="text-sm">{date.toLocaleDateString()}</div>;
                },
            },
        ],
        [],
    );

    const handleFilesUploaded = useCallback((results: UploadFileResponse[]) => {
        setUploadedFiles((prev) => [...results, ...prev]);
    }, []);

    const handleDemoFilesSelected = (files: File[]) => {
        const newFiles: FileItem[] = files.map((file, index) => ({
            id: `demo-${Date.now()}-${index}`,
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            progress: 0,
            status: 'pending' as const,
        }));
        setDemoFiles((prev) => [...prev, ...newFiles]);

        newFiles.forEach((fileItem) => {
            simulateUpload(fileItem.id);
        });
    };

    const simulateUpload = async (fileId: string) => {
        for (let i = 0; i <= 100; i += 10) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            setDemoFiles((prev) =>
                prev.map((f) =>
                    f.id === fileId
                        ? {
                              ...f,
                              progress: i,
                              status: i === 100 ? 'complete' : ('uploading' as const),
                              message: i === 100 ? 'Upload complete!' : `Uploading... ${i}%`,
                          }
                        : f,
                ),
            );
        }
    };

    const handleRemoveDemoFile = (fileId: string) => {
        setDemoFiles((prev) => {
            const file = prev.find((f) => f.id === fileId);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter((f) => f.id !== fileId);
        });
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
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 p-3">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">
                                Components Showcase
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Nuevos componentes modernos inspirados en Untitled UI
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <TableIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Tablas Mejoradas</h3>
                                <p className="text-sm text-muted-foreground">
                                    Diseño moderno con mejor jerarquía visual
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Upload Modular</h3>
                                <p className="text-sm text-muted-foreground">
                                    Sistema de componentes reutilizables
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Layout className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">3 Variantes</h3>
                                <p className="text-sm text-muted-foreground">
                                    Default, Compact y Minimal
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="tables" className="gap-2">
                        <TableIcon className="h-4 w-4" />
                        Tablas
                    </TabsTrigger>
                    <TabsTrigger value="upload-variants" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Base
                    </TabsTrigger>
                    <TabsTrigger value="specialized" className="gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Especializados
                    </TabsTrigger>
                    <TabsTrigger value="integrated" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Integrados
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tables" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TableIcon className="h-5 w-5" />
                                Tablas con Diseño Moderno
                            </CardTitle>
                            <CardDescription>
                                Nuevo diseño inspirado en Untitled UI con mejor jerarquía visual,
                                spacing y estados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={demoData} />
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-base">Headers Mejorados</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Uppercase con tracking wider</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Background sutil (bg-muted/30)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Mejor spacing y padding</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-base">Estados Visuales</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Hover mejorado (bg-muted/40)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Selection con bg-primary/5</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Bordes sutiles (border/50)</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/30">
                            <CardHeader>
                                <CardTitle className="text-base">Paginación</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Indicador visual de selección</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Layout responsive mejorado</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                                    <span>Botones con shadow-sm</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="upload-variants" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">FileDropzone - Default</CardTitle>
                                <CardDescription>
                                    Variante completa con todos los detalles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileDropzone
                                    onFilesAccepted={handleDemoFilesSelected}
                                    maxFiles={5}
                                    variant="default"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">FileDropzone - Compact</CardTitle>
                                <CardDescription>Versión compacta horizontal</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileDropzone
                                    onFilesAccepted={handleDemoFilesSelected}
                                    maxFiles={5}
                                    variant="compact"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">FileDropzone - Minimal</CardTitle>
                                <CardDescription>Versión minimalista para forms</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileDropzone
                                    onFilesAccepted={handleDemoFilesSelected}
                                    maxFiles={5}
                                    variant="minimal"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">FileUploadZone - Complete</CardTitle>
                                <CardDescription>Dropzone + Lista con progreso</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FileUploadZone
                                    files={demoFiles}
                                    onFilesSelected={handleDemoFilesSelected}
                                    onFileRemove={handleRemoveDemoFile}
                                    maxFiles={5}
                                    variant="compact"
                                    dropzoneVariant="minimal"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {demoFiles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>FileList - Demo</CardTitle>
                                        <CardDescription>
                                            Lista con indicadores de progreso y estados
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDemoFiles([])}
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <FileList
                                    files={demoFiles}
                                    onRemove={handleRemoveDemoFile}
                                    variant="default"
                                />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="specialized" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    ImageUploadZone
                                </CardTitle>
                                <CardDescription>
                                    Especializado para imágenes con preview automático
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageUploadZone
                                    files={[]}
                                    onFilesSelected={handleDemoFilesSelected}
                                    maxFiles={5}
                                    variant="compact"
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <VideoIcon className="h-5 w-5" />
                                    VideoUploadZone
                                </CardTitle>
                                <CardDescription>
                                    Especializado para videos con formatos preconfigurados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <VideoUploadZone
                                    files={[]}
                                    onFilesSelected={handleDemoFilesSelected}
                                    maxFiles={3}
                                    variant="compact"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle>Características de Componentes Especializados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                                        <ImageIcon className="h-4 w-4" />
                                        ImageUploadZone
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Formatos: PNG, JPG, GIF, WebP, SVG</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Max size por defecto: 10MB</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Preview automático habilitado</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Ideal para galerías y avatares</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                                        <VideoIcon className="h-4 w-4" />
                                        VideoUploadZone
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Formatos: MP4, WebM, OGG, MOV, AVI, MKV</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Max size por defecto: 500MB</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Optimizado para archivos grandes</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                                            <span>Integración con procesamiento FFmpeg</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrated" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>InlineFileUpload - Con Storage Backend</CardTitle>
                                    <CardDescription>
                                        Componente integrado con tu API de storage real
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <InlineFileUpload
                                        onFilesUploaded={handleFilesUploaded}
                                        maxFiles={5}
                                        visibility={StorageVisibilityEnum.PRIVATE}
                                        variant="compact"
                                    />
                                </CardContent>
                            </Card>

                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>InlineImageUpload</CardTitle>
                                        <CardDescription>
                                            Con optimización automática
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <InlineImageUpload
                                            onFilesUploaded={handleFilesUploaded}
                                            maxFiles={5}
                                            visibility={StorageVisibilityEnum.PUBLIC}
                                            variant="compact"
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>InlineVideoUpload</CardTitle>
                                        <CardDescription>Con procesamiento FFmpeg</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <InlineVideoUpload
                                            onFilesUploaded={handleFilesUploaded}
                                            maxFiles={2}
                                            visibility={StorageVisibilityEnum.PRIVATE}
                                            variant="compact"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <UploadDebugPanel />
                        </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                        <Card className="border-emerald-500/20 bg-emerald-500/5">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-emerald-500" />
                                            Archivos Subidos
                                        </CardTitle>
                                        <CardDescription>
                                            Procesados y almacenados en R2
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setUploadedFiles([])}
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {uploadedFiles.map((file, index) => (
                                        <div
                                            key={`uploaded-${file.id}-${index}`}
                                            className="flex items-center justify-between rounded-lg border bg-card p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded bg-emerald-500/10 p-2">
                                                    {file.mimeType.startsWith('image/') ? (
                                                        <ImageIcon className="h-4 w-4 text-emerald-500" />
                                                    ) : file.mimeType.startsWith('video/') ? (
                                                        <VideoIcon className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <FileText className="h-4 w-4 text-emerald-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {file.originalName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-emerald-600">
                                                {file.visibility}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardHeader>
                    <CardTitle>Arquitectura y Beneficios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div>
                            <h3 className="mb-3 font-semibold">Diseño</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Inspirado en Untitled UI</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Colores consistentes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Animaciones suaves</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Estados visuales claros</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 font-semibold">Arquitectura</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Componentes modulares</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Separación UI / Lógica</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Tree-shakeable</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>TypeScript completo</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-3 font-semibold">Developer Experience</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>API clara y consistente</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Props bien documentadas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Variantes flexibles</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                    <span>Fácil personalización</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
