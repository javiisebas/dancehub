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
import { CheckCircle, Maximize2, PlayCircle, Settings, Video } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

const VideoPlayer = dynamic(
    () => import('@repo/ui/components/client-only').then((m) => m.VideoPlayer),
    { ssr: false },
);

const sampleVideos = [
    {
        id: 'sample1',
        title: 'Big Buck Bunny',
        description: 'Video de prueba de código abierto',
        sources: [
            {
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                type: 'video/mp4',
                size: 720,
            },
        ],
        poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    },
    {
        id: 'sample2',
        title: 'Elephant Dream',
        description: 'Cortometraje animado',
        sources: [
            {
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                type: 'video/mp4',
                size: 720,
            },
        ],
        poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    },
    {
        id: 'sample3',
        title: 'For Bigger Blazes',
        description: 'Video de demostración',
        sources: [
            {
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                type: 'video/mp4',
                size: 720,
            },
        ],
        poster: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    },
];

export default function VideoPlayerDemoPage() {
    const [selectedVideo, setSelectedVideo] = useState(sampleVideos[0]);
    const [playCount, setPlayCount] = useState(0);

    const handlePlay = () => {
        setPlayCount((prev) => prev + 1);
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
                <h1 className="text-4xl font-bold tracking-tight">Video Player Demo</h1>
                <p className="text-xl text-muted-foreground">
                    Reproductor de video profesional con controles completos y múltiples calidades
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PlayCircle className="h-5 w-5" />
                                {selectedVideo.title}
                            </CardTitle>
                            <CardDescription>{selectedVideo.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-hidden rounded-lg border bg-black">
                                <VideoPlayer
                                    key={selectedVideo.id}
                                    sources={selectedVideo.sources}
                                    poster={selectedVideo.poster}
                                    autoplay={false}
                                    muted={false}
                                    controls={true}
                                    onPlay={handlePlay}
                                    onReady={(player) => {
                                        console.log('Player ready:', player);
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Controles del Reproductor</CardTitle>
                            <CardDescription>Controles integrados con Plyr</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Reproducción</h4>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>• Play/Pause</li>
                                        <li>• Adelantar/Retroceder</li>
                                        <li>• Velocidad de reproducción</li>
                                        <li>• Reiniciar video</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Visualización</h4>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>• Pantalla completa</li>
                                        <li>• Picture-in-Picture</li>
                                        <li>• Calidad de video</li>
                                        <li>• Captions/Subtítulos</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Audio</h4>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>• Control de volumen</li>
                                        <li>• Mute/Unmute</li>
                                        <li>• Slider de volumen</li>
                                        <li>• Guardado de preferencias</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">Interacción</h4>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>• Click para play/pause</li>
                                        <li>• Barra de progreso</li>
                                        <li>• Preview en hover</li>
                                        <li>• Atajos de teclado</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Videos de Ejemplo</CardTitle>
                            <CardDescription>Selecciona un video para reproducir</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                            {sampleVideos.map((video) => (
                                <button
                                    key={video.id}
                                    onClick={() => setSelectedVideo(video)}
                                    className={`group relative overflow-hidden rounded-lg border transition-all hover:border-primary ${
                                        selectedVideo.id === video.id
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : ''
                                    }`}
                                >
                                    <div className="relative aspect-video">
                                        <img
                                            src={video.poster}
                                            alt={video.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <PlayCircle className="h-8 w-8 text-white" />
                                        </div>
                                        {selectedVideo.id === video.id && (
                                            <div className="absolute right-2 top-2">
                                                <CheckCircle className="h-5 w-5 rounded-full bg-background text-primary" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2">
                                        <p className="truncate text-left text-xs font-medium">
                                            {video.title}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estadísticas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Videos Disponibles</p>
                                <p className="text-2xl font-bold">{sampleVideos.length}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Reproducciones</p>
                                <p className="text-2xl font-bold">{playCount}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Video className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Múltiples Calidades</p>
                                    <p className="text-xs text-muted-foreground">
                                        Soporte para 360p, 480p, 720p, 1080p, 4K
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Settings className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Subtítulos</p>
                                    <p className="text-xs text-muted-foreground">
                                        Soporte para WebVTT y múltiples idiomas
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
                                        Modo fullscreen y Picture-in-Picture
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <CheckCircle className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Responsive</p>
                                    <p className="text-xs text-muted-foreground">
                                        Se adapta a cualquier tamaño de pantalla
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
                                <p className="font-medium">Player</p>
                                <p className="text-muted-foreground">Plyr v3</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Formatos</p>
                                <p className="text-muted-foreground">MP4, WebM, Ogg</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Streaming</p>
                                <p className="text-muted-foreground">
                                    HLS, DASH (adaptive bitrate)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Funcionalidades Extra</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Progreso de visualización</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Marcadores de tiempo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Callbacks de eventos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>API programática</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Personalización completa</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Casos de Uso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Plataformas de cursos online</p>
                            <p>• Streaming de eventos</p>
                            <p>• Video marketing</p>
                            <p>• Tutoriales y demos</p>
                            <p>• Presentaciones</p>
                            <p>• Contenido premium</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Integración con Cursos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Tracking de progreso</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Detección de completado (90%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Marcadores de lección</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Navegación entre lecciones</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
