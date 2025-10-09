'use client';

import {
    CheckoutButton,
    ConnectedAccountSetup,
    PaymentForm,
    StripeProvider,
    useCreatePaymentIntent,
} from '@/features/payment';
import { CurrencyEnum, PaymentTypeEnum } from '@repo/shared';
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
import { CheckCircle, CreditCard, Loader2, Repeat, Shield, Store, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PaymentsDemoPage() {
    const [activePayments, setActivePayments] = useState<Array<{ type: string; amount: number }>>(
        [],
    );

    const handlePaymentSuccess = (type: string, amount: number) => {
        setActivePayments((prev) => [...prev, { type, amount }]);
        toast.success(`${type} completado exitosamente`);
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
                <h1 className="text-4xl font-bold tracking-tight">Payments Demo</h1>
                <p className="text-xl text-muted-foreground">
                    Sistema completo de pagos con Stripe: pagos únicos, suscripciones y marketplace
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Tabs defaultValue="one-time" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="one-time">Pago Único</TabsTrigger>
                            <TabsTrigger value="subscription">Suscripción</TabsTrigger>
                            <TabsTrigger value="checkout">Checkout</TabsTrigger>
                            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                        </TabsList>

                        <TabsContent value="one-time">
                            <OneTimePaymentDemo onSuccess={handlePaymentSuccess} />
                        </TabsContent>

                        <TabsContent value="subscription">
                            <SubscriptionDemo onSuccess={handlePaymentSuccess} />
                        </TabsContent>

                        <TabsContent value="checkout">
                            <CheckoutDemo onSuccess={handlePaymentSuccess} />
                        </TabsContent>

                        <TabsContent value="marketplace">
                            <MarketplaceDemo onSuccess={handlePaymentSuccess} />
                        </TabsContent>
                    </Tabs>

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Modos de Integración</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        Payment Intent
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        API directa con Stripe Elements integrado en tu UI
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <Repeat className="h-4 w-4 text-primary" />
                                        Checkout Session
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Redirección a página de checkout hosteada por Stripe
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <Store className="h-4 w-4 text-primary" />
                                        Connect
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        Plataforma marketplace con cuentas conectadas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {activePayments.length > 0 && (
                        <Card className="border-green-500/20 bg-green-500/5">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        Pagos Realizados
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActivePayments([])}
                                    >
                                        Limpiar
                                    </Button>
                                </div>
                                <CardDescription>Pagos de prueba (modo sandbox)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {activePayments.map((payment, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between rounded-lg border bg-background p-3"
                                    >
                                        <span className="text-sm font-medium">{payment.type}</span>
                                        <Badge
                                            variant="outline"
                                            className="border-green-500/20 bg-green-500/10 text-green-500"
                                        >
                                            ${(payment.amount / 100).toFixed(2)}
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Shield className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">PCI Compliant</p>
                                    <p className="text-xs text-muted-foreground">
                                        Seguridad nivel bancario con Stripe
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Zap className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Webhooks</p>
                                    <p className="text-xs text-muted-foreground">
                                        Eventos en tiempo real de pagos
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Repeat className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Suscripciones</p>
                                    <p className="text-xs text-muted-foreground">
                                        Facturación recurrente automática
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-primary/10 p-1">
                                    <Store className="h-3 w-3 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Marketplace</p>
                                    <p className="text-xs text-muted-foreground">
                                        Pagos a múltiples vendedores
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Métodos de Pago</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Tarjetas de crédito/débito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Google Pay / Apple Pay</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>SEPA Direct Debit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>iDEAL, Bancontact, etc.</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tecnología</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium">Proveedor</p>
                                <p className="text-muted-foreground">Stripe API v2023</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Frontend</p>
                                <p className="text-muted-foreground">Stripe Elements + React</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="font-medium">Backend</p>
                                <p className="text-muted-foreground">NestJS + Clean Architecture</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-base">Casos de Uso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• E-commerce y tiendas online</p>
                            <p>• Plataformas de cursos (SaaS)</p>
                            <p>• Suscripciones de contenido</p>
                            <p>• Marketplace multi-vendedor</p>
                            <p>• Donaciones y crowdfunding</p>
                            <p>• Servicios profesionales</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Test Cards</CardTitle>
                            <CardDescription>Usa estas tarjetas para probar</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="rounded-lg border bg-background p-3">
                                <p className="mb-1 text-xs font-semibold">Éxito</p>
                                <p className="font-mono text-sm">4242 4242 4242 4242</p>
                            </div>
                            <div className="rounded-lg border bg-background p-3">
                                <p className="mb-1 text-xs font-semibold">3D Secure</p>
                                <p className="font-mono text-sm">4000 0027 6000 3184</p>
                            </div>
                            <div className="rounded-lg border bg-background p-3">
                                <p className="mb-1 text-xs font-semibold">Declined</p>
                                <p className="font-mono text-sm">4000 0000 0000 0002</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Cualquier fecha futura y CVC
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function OneTimePaymentDemo({ onSuccess }: { onSuccess: (type: string, amount: number) => void }) {
    const {
        mutate: createPaymentIntent,
        data: paymentIntent,
        isPending,
    } = useCreatePaymentIntent();
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const amounts = [
        { label: '$10.00', value: 1000 },
        { label: '$25.00', value: 2500 },
        { label: '$50.00', value: 5000 },
    ];

    const handleCreatePayment = (amount: number) => {
        createPaymentIntent(
            {
                amount,
                currency: CurrencyEnum.USD,
                paymentType: PaymentTypeEnum.ONE_TIME,
                description: `One-time payment of $${(amount / 100).toFixed(2)}`,
            },
            {
                onSuccess: () => {
                    setShowPaymentForm(true);
                },
            },
        );
    };

    const handleSuccess = () => {
        if (paymentIntent) {
            onSuccess('Pago Único', paymentIntent.amount);
        }
        setShowPaymentForm(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pago Único (One-Time Payment)
                </CardTitle>
                <CardDescription>Procesa un pago único con Stripe Payment Intent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!showPaymentForm ? (
                    <>
                        <p className="text-sm text-muted-foreground">
                            Selecciona un monto para crear un Payment Intent:
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {amounts.map((item) => (
                                <Button
                                    key={item.value}
                                    onClick={() => handleCreatePayment(item.value)}
                                    disabled={isPending}
                                    variant="outline"
                                    className="h-20"
                                >
                                    {isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        item.label
                                    )}
                                </Button>
                            ))}
                        </div>
                    </>
                ) : (
                    paymentIntent && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPaymentForm(false)}
                            >
                                ← Volver
                            </Button>
                            <StripeProvider>
                                <PaymentForm
                                    paymentIntent={paymentIntent}
                                    onSuccess={handleSuccess}
                                />
                            </StripeProvider>
                        </>
                    )
                )}
            </CardContent>
        </Card>
    );
}

function SubscriptionDemo({ onSuccess }: { onSuccess: (type: string, amount: number) => void }) {
    const handleCheckout = (amount: number) => {
        onSuccess('Suscripción', amount);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Repeat className="h-5 w-5" />
                    Suscripciones
                </CardTitle>
                <CardDescription>
                    Crea suscripciones recurrentes con facturación automática
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3 rounded-lg border p-4">
                        <div>
                            <h3 className="font-semibold">Plan Mensual</h3>
                            <p className="text-2xl font-bold">$19.99/mes</p>
                        </div>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Acceso completo a la plataforma</li>
                            <li>• Soporte por email</li>
                            <li>• Actualizaciones incluidas</li>
                        </ul>
                        <CheckoutButton
                            amount={1999}
                            currency="usd"
                            name="Plan Mensual"
                            description="Suscripción mensual"
                            mode="subscription"
                            className="w-full"
                        >
                            Suscribirse Mensual
                        </CheckoutButton>
                    </div>

                    <div className="relative space-y-3 rounded-lg border-2 border-primary p-4">
                        <Badge className="absolute -top-3 right-4">Popular</Badge>
                        <div>
                            <h3 className="font-semibold">Plan Anual</h3>
                            <p className="text-2xl font-bold">$199.99/año</p>
                            <p className="text-xs text-muted-foreground">Ahorra 2 meses</p>
                        </div>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Todo del plan mensual</li>
                            <li>• Soporte prioritario</li>
                            <li>• Descuento del 17%</li>
                        </ul>
                        <CheckoutButton
                            amount={19999}
                            currency="usd"
                            name="Plan Anual"
                            description="Suscripción anual"
                            mode="subscription"
                            className="w-full"
                        >
                            Suscribirse Anual
                        </CheckoutButton>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function CheckoutDemo({ onSuccess }: { onSuccess: (type: string, amount: number) => void }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Checkout Session
                </CardTitle>
                <CardDescription>
                    Redirección a página de checkout hosteada por Stripe
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    El usuario es redirigido a una página segura de Stripe para completar el pago.
                </p>

                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Curso Premium</p>
                            <p className="text-sm text-muted-foreground">Acceso completo</p>
                        </div>
                        <p className="text-xl font-bold">$99.00</p>
                    </div>
                    <CheckoutButton
                        amount={9900}
                        currency="usd"
                        name="Curso Premium"
                        description="Acceso completo al curso"
                        mode="payment"
                        className="w-full"
                    >
                        Comprar Ahora
                    </CheckoutButton>
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">Ticket de Evento</p>
                            <p className="text-sm text-muted-foreground">Conferencia 2024</p>
                        </div>
                        <p className="text-xl font-bold">$45.00</p>
                    </div>
                    <CheckoutButton
                        amount={4500}
                        currency="usd"
                        name="Ticket de Evento"
                        description="Conferencia 2024"
                        mode="payment"
                        className="w-full"
                    >
                        Comprar Ticket
                    </CheckoutButton>
                </div>
            </CardContent>
        </Card>
    );
}

function MarketplaceDemo({ onSuccess }: { onSuccess: (type: string, amount: number) => void }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Marketplace (Stripe Connect)
                </CardTitle>
                <CardDescription>Plataforma con múltiples vendedores y comisiones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Permite a los vendedores crear cuentas conectadas para recibir pagos
                    directamente.
                </p>

                <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                    <h4 className="font-semibold">Cómo funciona:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2">
                            <span className="text-primary">1.</span>
                            El vendedor crea una cuenta conectada de Stripe
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary">2.</span>
                            Los clientes pagan a través de tu plataforma
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary">3.</span>
                            La plataforma retiene su comisión (ej: 5%)
                        </li>
                        <li className="flex gap-2">
                            <span className="text-primary">4.</span>
                            El resto va directamente al vendedor
                        </li>
                    </ul>
                </div>

                <Separator />

                <div>
                    <h4 className="mb-3 font-semibold">Configurar Cuenta de Vendedor</h4>
                    <ConnectedAccountSetup
                        onSuccess={() => {
                            onSuccess('Cuenta Conectada', 0);
                        }}
                    />
                </div>

                <div className="space-y-2 rounded-lg border bg-primary/5 p-4">
                    <p className="text-sm font-medium">Ejemplo de Pago en Marketplace:</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Precio del producto</span>
                        <span>$100.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Comisión plataforma (5%)</span>
                        <span className="text-primary">- $5.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                        <span>Vendedor recibe</span>
                        <span>$95.00</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
