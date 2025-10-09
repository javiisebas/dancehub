'use client';

import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { RichTextEditor } from '@repo/ui/components/rich-text-editor';
import { RichTextRenderer } from '@repo/ui/components/rich-text-editor/rich-text-renderer';
import { Separator } from '@repo/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { CheckCircle, Code, Link as LinkIcon, List, PenTool, Table, Type } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const initialContent = `<h2>Bienvenido al Rich Text Editor</h2><p>Este es un editor de texto enriquecido completo con múltiples características:</p><h3>Características Principales</h3><ul><li><strong>Formato de texto</strong>: Negrita, cursiva, subrayado, tachado</li><li><strong>Encabezados</strong>: De H1 a H6</li><li><strong>Listas</strong>: Numeradas y con viñetas</li><li><strong>Enlaces</strong>: <a href="https://example.com">Enlaces personalizados</a></li><li><strong>Imágenes</strong>: Inserción de imágenes</li></ul><h3>Código y Sintaxis</h3><p>Puedes escribir código inline como <code>const hello = "world"</code> o bloques de código:</p><pre><code>function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}</code></pre><h3>Tablas</h3><table><thead><tr><th>Feature</th><th>Status</th><th>Notes</th></tr></thead><tbody><tr><td>Text Formatting</td><td>✓</td><td>Complete</td></tr><tr><td>Images</td><td>✓</td><td>Complete</td></tr><tr><td>Tables</td><td>✓</td><td>Complete</td></tr></tbody></table><blockquote><p>Este es un ejemplo de cita en bloque. Útil para resaltar información importante.</p></blockquote><p>¡Empieza a editar para ver todas las características en acción!</p>`;

export default function MarkdownEditorDemoPage() {
    const [content, setContent] = useState(initialContent);
    const [savedContent, setSavedContent] = useState('');
    const [isEditing, setIsEditing] = useState(true);

    const handleSave = () => {
        setSavedContent(content);
        setIsEditing(false);
    };

    const handleReset = () => {
        setContent(initialContent);
        setSavedContent('');
        setIsEditing(true);
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
                <h1 className="text-4xl font-bold tracking-tight">Markdown Editor Demo</h1>
                <p className="text-xl text-muted-foreground">
                    Editor de texto enriquecido con Markdown, tablas, código y más
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Tabs value={isEditing ? 'editor' : 'preview'} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="editor" onClick={() => setIsEditing(true)}>
                                    Editor
                                </TabsTrigger>
                                <TabsTrigger value="preview" onClick={() => setIsEditing(false)}>
                                    Vista Previa
                                </TabsTrigger>
                            </TabsList>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleReset}>
                                    Resetear
                                </Button>
                                {isEditing && (
                                    <Button size="sm" onClick={handleSave}>
                                        Guardar
                                    </Button>
                                )}
                            </div>
                        </div>

                        <TabsContent value="editor">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <PenTool className="h-5 w-5" />
                                        Editor WYSIWYG
                                    </CardTitle>
                                    <CardDescription>
                                        Edita el contenido usando la barra de herramientas o atajos
                                        de teclado
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RichTextEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder="Empieza a escribir..."
                                        minHeight="500px"
                                        editable={true}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preview">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vista Previa Renderizada</CardTitle>
                                    <CardDescription>
                                        Así se verá tu contenido publicado
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border p-6">
                                        <RichTextRenderer content={content} />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {savedContent && (
                        <Card className="border-green-500/20 bg-green-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Contenido Guardado
                                </CardTitle>
                                <CardDescription>
                                    Este es el último contenido guardado
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg border bg-background p-6">
                                    <RichTextRenderer content={savedContent} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Atajos de Teclado</CardTitle>
                            <CardDescription>Acelera tu edición con estos atajos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        Ctrl + B
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">Negrita</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        Ctrl + I
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">Cursiva</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        Ctrl + U
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">Subrayado</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        Ctrl + K
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">
                                        Insertar link
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        Ctrl + Z
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">Deshacer</span>
                                </div>
                                <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
                                    <kbd className="rounded bg-muted px-2 py-1 text-sm font-semibold">
                                        Ctrl + Y
                                    </kbd>
                                    <span className="text-sm text-muted-foreground">Rehacer</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Type className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Formato de Texto</p>
                                    <p className="text-xs text-muted-foreground">
                                        Negrita, cursiva, subrayado, tachado, colores
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <List className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Listas</p>
                                    <p className="text-xs text-muted-foreground">
                                        Listas numeradas, con viñetas y anidadas
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <LinkIcon className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Enlaces e Imágenes</p>
                                    <p className="text-xs text-muted-foreground">
                                        Inserta links e imágenes fácilmente
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Table className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Tablas</p>
                                    <p className="text-xs text-muted-foreground">
                                        Crea y edita tablas redimensionables
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Code className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Bloques de Código</p>
                                    <p className="text-xs text-muted-foreground">
                                        Syntax highlighting con Lowlight
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
                                <p className="font-medium">Editor</p>
                                <p className="text-muted-foreground">Tiptap + ProseMirror</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Extensiones</p>
                                <p className="text-muted-foreground">
                                    StarterKit, Tables, Images, Links, Code
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Syntax Highlighting</p>
                                <p className="text-muted-foreground">Lowlight (Highlight.js)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardTitle className="p-6 pb-3 text-base">Casos de Uso</CardTitle>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Blogs y artículos</p>
                            <p>• Documentación técnica</p>
                            <p>• Descripciones de productos</p>
                            <p>• Contenido de cursos</p>
                            <p>• Emails y newsletters</p>
                            <p>• Comentarios enriquecidos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Integraciones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>React Hook Form</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Zod Validation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Auto Forms</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Server Actions</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
