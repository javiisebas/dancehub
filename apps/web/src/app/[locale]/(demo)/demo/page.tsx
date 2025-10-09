import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import {
    CreditCard,
    FileText,
    FileUp,
    FormInput,
    LayoutList,
    PenTool,
    PlayCircle,
} from 'lucide-react';
import Link from 'next/link';

const demos = [
    {
        title: 'File Upload',
        description:
            'Sistema completo de carga de archivos con progreso en tiempo real, validación y WebSocket',
        icon: FileUp,
        href: '/demo/file-upload',
        features: [
            'Drag & Drop',
            'Progreso en tiempo real',
            'Múltiples tipos de archivo',
            'Validación automática',
        ],
    },
    {
        title: 'PDF Reader',
        description:
            'Visor de PDF profesional con navegación, zoom, búsqueda y controles de teclado',
        icon: FileText,
        href: '/demo/pdf-reader',
        features: [
            'Navegación completa',
            'Zoom avanzado',
            'Búsqueda de texto',
            'Pantalla completa',
        ],
    },
    {
        title: 'Markdown Editor',
        description: 'Editor de texto enriquecido con Markdown, tablas, imágenes, código y más',
        icon: PenTool,
        href: '/demo/markdown-editor',
        features: ['WYSIWYG', 'Syntax highlighting', 'Tablas', 'Imágenes y enlaces'],
    },
    {
        title: 'Data Tables',
        description: 'Tablas de datos con paginación, ordenamiento, filtros y selección múltiple',
        icon: LayoutList,
        href: '/demo/data-tables',
        features: [
            'Paginación server-side',
            'Ordenamiento',
            'Filtros avanzados',
            'Selección múltiple',
        ],
    },
    {
        title: 'Auto Forms',
        description:
            'Generación automática de formularios desde schemas Zod con validación type-safe',
        icon: FormInput,
        href: '/demo/auto-forms',
        features: ['Auto-generado', 'Type-safe', 'Validación Zod', 'Server Actions'],
    },
    {
        title: 'Video Player',
        description:
            'Reproductor de video profesional con múltiples calidades, subtítulos y controles completos',
        icon: PlayCircle,
        href: '/demo/video-player',
        features: ['Múltiples calidades', 'Subtítulos', 'Controles avanzados', 'Plyr integration'],
    },
    {
        title: 'Payments',
        description: 'Sistema de pagos con Stripe: pagos únicos, suscripciones y marketplace',
        icon: CreditCard,
        href: '/demo/payments',
        features: ['Pagos únicos', 'Suscripciones', 'Marketplace', 'Checkout session'],
    },
];

export default function DemoPage() {
    return (
        <div className="container mx-auto space-y-8 py-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Demo Center</h1>
                <p className="text-xl text-muted-foreground">
                    Explora todas las funcionalidades del sistema con demos interactivas
                    profesionales
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {demos.map((demo) => {
                    const Icon = demo.icon;
                    return (
                        <Card key={demo.href} className="flex flex-col">
                            <CardHeader>
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{demo.title}</CardTitle>
                                </div>
                                <CardDescription>{demo.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col justify-between gap-4">
                                <ul className="space-y-2">
                                    {demo.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2 text-sm"
                                        >
                                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={demo.href} className="w-full">
                                    <Button className="w-full">Ver Demo</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle>Arquitectura del Sistema</CardTitle>
                    <CardDescription>
                        Todos estos componentes están construidos con las mejores prácticas
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <h3 className="font-semibold">Frontend</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Next.js 15 + React 19</li>
                            <li>• TypeScript Strict</li>
                            <li>• Shadcn/ui + Tailwind</li>
                            <li>• TanStack Query</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Backend</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• NestJS + Clean Architecture</li>
                            <li>• PostgreSQL + Drizzle ORM</li>
                            <li>• WebSocket (Socket.io)</li>
                            <li>• Stripe + R2 Storage</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Características</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Type-safe end-to-end</li>
                            <li>• Real-time updates</li>
                            <li>• i18n Multi-idioma</li>
                            <li>• Testing E2E</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
