'use client';

import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { CheckCircle, Download, FileText, Maximize2, Search, ZoomIn } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

const PDFViewer = dynamic(
    () => import('@repo/ui/components/client-only').then((m) => m.PDFViewer),
    { ssr: false },
);

const samplePDFs = [
    {
        id: 'sample1',
        name: 'Documento de Ejemplo',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        description: 'PDF técnico con múltiples páginas',
    },
    {
        id: 'sample2',
        name: 'Especificación PDF',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'PDF simple para pruebas',
    },
];

export default function PDFReaderDemoPage() {
    const [selectedPDF, setSelectedPDF] = useState(samplePDFs[0]);

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
                <h1 className="text-4xl font-bold tracking-tight">PDF Reader Demo</h1>
                <p className="text-xl text-muted-foreground">
                    Visor de PDF profesional con navegación completa y controles avanzados
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                {selectedPDF.name}
                            </CardTitle>
                            <CardDescription>{selectedPDF.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg border">
                                <PDFViewer url={selectedPDF.url} filename={selectedPDF.name} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Controles de Teclado</CardTitle>
                            <CardDescription>Navega más rápido con estos atajos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        ← →
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">
                                        Página anterior/siguiente
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        + -
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">
                                        Zoom in/out
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        F
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">
                                        Pantalla completa
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        ESC
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">
                                        Salir pantalla completa
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>PDFs de Ejemplo</CardTitle>
                            <CardDescription>Selecciona un PDF para visualizar</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {samplePDFs.map((pdf) => (
                                <button
                                    key={pdf.id}
                                    onClick={() => setSelectedPDF(pdf)}
                                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted ${
                                        selectedPDF.id === pdf.id
                                            ? 'border-primary bg-primary/5'
                                            : ''
                                    }`}
                                >
                                    <div className="rounded bg-primary/10 p-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {pdf.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {pdf.description}
                                        </p>
                                    </div>
                                    {selectedPDF.id === pdf.id && (
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    )}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <CheckCircle className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Navegación Completa</p>
                                    <p className="text-xs text-muted-foreground">
                                        Avanza/retrocede páginas con controles o teclado
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <ZoomIn className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Zoom Avanzado</p>
                                    <p className="text-xs text-muted-foreground">
                                        Aumenta/reduce de 50% a 300% con precisión
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Search className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Búsqueda de Texto</p>
                                    <p className="text-xs text-muted-foreground">
                                        Busca palabras en todo el documento (próximamente)
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Maximize2 className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Pantalla Completa</p>
                                    <p className="text-xs text-muted-foreground">
                                        Visualiza el PDF sin distracciones
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Download className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Descarga</p>
                                    <p className="text-xs text-muted-foreground">
                                        Descarga el PDF original
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tecnología</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium">Librería</p>
                                <p className="text-muted-foreground">
                                    react-pdf + PDF.js (Mozilla)
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Renderizado</p>
                                <p className="text-muted-foreground">
                                    Canvas HTML5 con aceleración de hardware
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Capas</p>
                                <p className="text-muted-foreground">
                                    Text layer (selección) + Annotation layer (links)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Casos de Uso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Documentación de productos</p>
                            <p>• Contratos y documentos legales</p>
                            <p>• Manuales y guías</p>
                            <p>• Reportes y presentaciones</p>
                            <p>• Currículums y portfolios</p>
                            <p>• E-books y publicaciones</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
