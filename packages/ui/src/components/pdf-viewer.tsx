'use client';

import {
    ChevronLeft,
    ChevronRight,
    Download,
    Maximize,
    Minimize,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from './button';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import { Skeleton } from './skeleton';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    url: string;
    filename?: string;
    onDownload?: () => void;
    className?: string;
}

export function PDFViewer({ url, filename, onDownload, className }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setIsLoading(false);
    }

    function onDocumentLoadError(error: Error) {
        console.error('Error loading PDF:', error);
        setIsLoading(false);
    }

    const goToPrevPage = useCallback(() => {
        setPageNumber((prev) => Math.max(1, prev - 1));
    }, []);

    const goToNextPage = useCallback(() => {
        setPageNumber((prev) => Math.min(numPages, prev + 1));
    }, [numPages]);

    const zoomIn = useCallback(() => {
        setScale((prev) => Math.min(3.0, prev + 0.2));
    }, []);

    const zoomOut = useCallback(() => {
        setScale((prev) => Math.max(0.5, prev - 0.2));
    }, []);

    const resetZoom = useCallback(() => {
        setScale(1.0);
    }, []);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen((prev) => !prev);
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrevPage();
            if (e.key === 'ArrowRight') goToNextPage();
            if (e.key === '+') zoomIn();
            if (e.key === '-') zoomOut();
            if (e.key === 'f' || e.key === 'F') toggleFullscreen();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [goToPrevPage, goToNextPage, zoomIn, zoomOut, toggleFullscreen]);

    return (
        <div
            className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''} ${className}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            min={1}
                            max={numPages}
                            value={pageNumber}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= numPages) {
                                    setPageNumber(page);
                                }
                            }}
                            className="w-16 text-center"
                        />
                        <span className="text-sm text-muted-foreground">/ {numPages}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={resetZoom}>
                        {Math.round(scale * 100)}%
                    </Button>
                    <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    {onDownload && (
                        <Button variant="outline" size="sm" onClick={onDownload}>
                            <Download className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                        {isFullscreen ? (
                            <Minimize className="h-4 w-4" />
                        ) : (
                            <Maximize className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {filename && (
                <div className="border-b bg-muted/20 px-4 py-2">
                    <p className="truncate text-sm font-medium">{filename}</p>
                </div>
            )}

            <ScrollArea className="flex-1">
                <div className="flex min-h-[600px] items-start justify-center p-4">
                    {isLoading && <Skeleton className="h-[800px] w-full max-w-4xl rounded-lg" />}
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<Skeleton className="h-[800px] w-full max-w-4xl rounded-lg" />}
                        className="shadow-lg"
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className="rounded-lg bg-white"
                            loading={<Skeleton className="h-[800px] w-full max-w-4xl rounded-lg" />}
                        />
                    </Document>
                </div>
            </ScrollArea>

            <div className="border-t bg-muted/30 p-4">
                <p className="text-center text-xs text-muted-foreground">
                    Usa las flechas del teclado para navegar • + / - para zoom • F para pantalla
                    completa
                </p>
            </div>
        </div>
    );
}
