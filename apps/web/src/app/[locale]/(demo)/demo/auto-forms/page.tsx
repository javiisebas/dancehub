'use client';

import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { AutoForm } from '@repo/ui/components/forms';
import { Separator } from '@repo/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { CheckCircle, Code, FormInput, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
});

const registerSchema = z
    .object({
        name: z.string().min(2, 'Mínimo 2 caracteres'),
        email: z.string().email('Email inválido'),
        password: z.string().min(8, 'Mínimo 8 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
    });

const profileSchema = z.object({
    fullName: z.string().min(2, 'Mínimo 2 caracteres'),
    bio: z.string().max(500, 'Máximo 500 caracteres').optional(),
    website: z.string().url('URL inválida').optional().or(z.literal('')),
    phone: z
        .string()
        .regex(/^\+?[\d\s-()]+$/, 'Teléfono inválido')
        .optional()
        .or(z.literal('')),
});

const contactSchema = z.object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    subject: z.string().min(5, 'Mínimo 5 caracteres'),
    message: z.string().min(20, 'Mínimo 20 caracteres'),
});

export default function AutoFormsDemoPage() {
    const [submissions, setSubmissions] = useState<Array<{ form: string; data: any }>>([]);

    const mockAction = (formName: string) => async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSubmissions((prev) => [{ form: formName, data }, ...prev]);

        return { success: true };
    };

    const handleSuccess = (formName: string) => {
        toast.success(`${formName} completado exitosamente`);
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
                <h1 className="text-4xl font-bold tracking-tight">Auto Forms Demo</h1>
                <p className="text-xl text-muted-foreground">
                    Generación automática de formularios desde schemas Zod con validación type-safe
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Tabs defaultValue="login" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Registro</TabsTrigger>
                            <TabsTrigger value="profile">Perfil</TabsTrigger>
                            <TabsTrigger value="contact">Contacto</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FormInput className="h-5 w-5" />
                                        Formulario de Login
                                    </CardTitle>
                                    <CardDescription>
                                        Auto-generado desde un schema Zod con 2 campos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AutoForm
                                        schema={loginSchema}
                                        action={mockAction('Login')}
                                        submitText="Iniciar Sesión"
                                        onSuccess={() => handleSuccess('Login')}
                                        fieldConfig={{
                                            email: {
                                                label: 'Email',
                                                placeholder: 'tu@email.com',
                                                type: 'email',
                                                description: 'Ingresa tu email registrado',
                                            },
                                            password: {
                                                label: 'Contraseña',
                                                placeholder: '••••••••',
                                                type: 'password',
                                                description: 'Mínimo 8 caracteres',
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="register">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FormInput className="h-5 w-5" />
                                        Formulario de Registro
                                    </CardTitle>
                                    <CardDescription>
                                        Con validación custom (confirmación de contraseña)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AutoForm
                                        schema={registerSchema}
                                        action={mockAction('Registro')}
                                        submitText="Crear Cuenta"
                                        onSuccess={() => handleSuccess('Registro')}
                                        fieldConfig={{
                                            name: {
                                                label: 'Nombre completo',
                                                placeholder: 'Juan Pérez',
                                                type: 'text',
                                            },
                                            email: {
                                                label: 'Email',
                                                placeholder: 'tu@email.com',
                                                type: 'email',
                                            },
                                            password: {
                                                label: 'Contraseña',
                                                placeholder: '••••••••',
                                                type: 'password',
                                            },
                                            confirmPassword: {
                                                label: 'Confirmar contraseña',
                                                placeholder: '••••••••',
                                                type: 'password',
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FormInput className="h-5 w-5" />
                                        Formulario de Perfil
                                    </CardTitle>
                                    <CardDescription>
                                        Con campos opcionales y validaciones personalizadas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AutoForm
                                        schema={profileSchema}
                                        action={mockAction('Perfil')}
                                        submitText="Guardar Perfil"
                                        onSuccess={() => handleSuccess('Perfil')}
                                        fieldConfig={{
                                            fullName: {
                                                label: 'Nombre completo',
                                                placeholder: 'Juan Pérez',
                                                type: 'text',
                                            },
                                            bio: {
                                                label: 'Biografía',
                                                placeholder: 'Cuéntanos sobre ti...',
                                                type: 'text',
                                                description: 'Máximo 500 caracteres',
                                            },
                                            website: {
                                                label: 'Sitio web',
                                                placeholder: 'https://tusitio.com',
                                                type: 'url',
                                                description: 'Opcional',
                                            },
                                            phone: {
                                                label: 'Teléfono',
                                                placeholder: '+34 123 456 789',
                                                type: 'tel',
                                                description: 'Opcional',
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="contact">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FormInput className="h-5 w-5" />
                                        Formulario de Contacto
                                    </CardTitle>
                                    <CardDescription>
                                        Formulario completo de contacto con validaciones
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AutoForm
                                        schema={contactSchema}
                                        action={mockAction('Contacto')}
                                        submitText="Enviar Mensaje"
                                        onSuccess={() => handleSuccess('Contacto')}
                                        fieldConfig={{
                                            name: {
                                                label: 'Nombre',
                                                placeholder: 'Tu nombre',
                                                type: 'text',
                                            },
                                            email: {
                                                label: 'Email',
                                                placeholder: 'tu@email.com',
                                                type: 'email',
                                            },
                                            subject: {
                                                label: 'Asunto',
                                                placeholder: '¿En qué podemos ayudarte?',
                                                type: 'text',
                                            },
                                            message: {
                                                label: 'Mensaje',
                                                placeholder: 'Describe tu consulta...',
                                                type: 'text',
                                                description: 'Mínimo 20 caracteres',
                                            },
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {submissions.length > 0 && (
                        <Card className="border-green-500/20 bg-green-500/5">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Últimos Envíos
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSubmissions([])}
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                                <CardDescription>
                                    Datos enviados (simulados, no se guardan)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {submissions.slice(0, 3).map((submission, idx) => (
                                    <div key={idx} className="rounded-lg border bg-background p-4">
                                        <p className="mb-2 text-sm font-semibold">
                                            {submission.form}
                                        </p>
                                        <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
                                            {JSON.stringify(submission.data, null, 2)}
                                        </pre>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ventajas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Zap className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Ultra Rápido</p>
                                    <p className="text-xs text-muted-foreground">
                                        De 70 líneas a 10 líneas de código
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Shield className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Type-Safe</p>
                                    <p className="text-xs text-muted-foreground">
                                        TypeScript end-to-end sin errores
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <CheckCircle className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Validación Automática</p>
                                    <p className="text-xs text-muted-foreground">
                                        Client y server-side desde el schema
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Code className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">DRY</p>
                                    <p className="text-xs text-muted-foreground">
                                        Define una vez, usa en todas partes
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Auto-generación de campos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Validación Zod integrada</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>React Hook Form</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Server Actions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Loading states automáticos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Error handling</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Configuración flexible</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tecnología</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium">Validación</p>
                                <p className="text-muted-foreground">Zod Schemas</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Forms</p>
                                <p className="text-muted-foreground">React Hook Form</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Actions</p>
                                <p className="text-muted-foreground">Next Safe Action</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Ejemplo de Código</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="overflow-x-auto rounded bg-background p-3 text-xs">
                                {`// Schema
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Form (¡solo esto!)
<AutoForm
  schema={schema}
  action={loginAction}
  submitText="Login"
/>`}
                            </pre>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Casos de Uso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Formularios de autenticación</p>
                            <p>• Perfiles de usuario</p>
                            <p>• Configuraciones</p>
                            <p>• Filtros de búsqueda</p>
                            <p>• Formularios de contacto</p>
                            <p>• CRUD operations</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
