# Sistema de Pagos con Stripe

## Arquitectura

El sistema de pagos sigue una arquitectura hexagonal con tres capas principales:

-   **Domain**: Entidades, repositorios y servicios de dominio
-   **Application**: Casos de uso (commands, queries, handlers)
-   **Infrastructure**: Implementaciones de repositorios, controladores, schemas

## Funcionalidades

### ✅ Pagos Puntuales (One-Time Payments)

-   Crear intenciones de pago
-   Procesar pagos únicos
-   Reembolsos totales y parciales

### ✅ Suscripciones

-   Crear suscripciones mensuales/anuales
-   Cancelar suscripciones
-   Renovación automática
-   Gestión de períodos de prueba

### ✅ Marketplace / Connected Accounts

-   Crear cuentas conectadas para vendedores
-   Pagos con comisión de plataforma
-   Onboarding de vendedores
-   Transferencias a cuentas conectadas

### ✅ Feature Packs

-   Paquetes de características pagadas
-   Activación de feature flags por usuario
-   Gestión de características compradas

### ✅ Webhooks

-   Procesamiento automático de eventos de Stripe
-   Sincronización de estados de pagos
-   Manejo de renovaciones de suscripciones
-   Registro de eventos para auditoría

## Uso Rápido

### 1. Configuración Inicial

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves de Stripe

# Ejecutar migraciones
pnpm db:push

# Crear datos de prueba en Stripe
pnpm tsx scripts/setup-payment-test-data.ts
```

### 2. Uso desde cualquier módulo

#### Opción A: Usar PaymentFacadeService (Recomendado)

```typescript
import { PaymentFacadeService } from '@api/modules/payment/application/services/payment-facade.service';
import { CurrencyEnum } from '@repo/shared';

@Injectable()
export class YourService {
    constructor(private readonly paymentFacade: PaymentFacadeService) {}

    async processPayment(userId: string) {
        // Crear un pago simple
        const { paymentIntent, clientSecret } = await this.paymentFacade.createSimplePayment(
            userId,
            2000, // $20.00
            CurrencyEnum.USD,
            'Payment for dance class',
        );

        // Verificar si tiene suscripción activa
        const hasSubscription = await this.paymentFacade.hasActiveSubscription(userId);

        // Obtener pagos del usuario
        const payments = await this.paymentFacade.getUserPaymentIntents(userId);

        return { clientSecret, hasSubscription };
    }
}
```

#### Opción B: Usar Command Handlers directamente

```typescript
import { CreatePaymentIntentHandler } from '@api/modules/payment/application/commands/create-payment-intent.handler';

@Injectable()
export class YourService {
    constructor(private readonly createPaymentHandler: CreatePaymentIntentHandler) {}

    async createPayment(userId: string) {
        const command = new CreatePaymentIntentCommand({
            amount: 5000,
            currency: CurrencyEnum.USD,
            paymentType: PaymentTypeEnum.ONE_TIME,
            description: 'Workshop registration',
        });

        return this.createPaymentHandler.execute({ ...command, userId });
    }
}
```

### 3. Endpoints de API

#### Crear Payment Intent

```http
POST /api/payment/intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 2000,
  "currency": "USD",
  "paymentType": "one_time",
  "description": "Dance class payment"
}
```

#### Crear Suscripción

```http
POST /api/payment/subscription
Authorization: Bearer {token}
Content-Type: application/json

{
  "priceId": "price_xxxxx",
  "metadata": { "plan": "premium" }
}
```

#### Crear Checkout Session

```http
POST /api/payment/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "mode": "one_time",
  "lineItems": [{
    "amount": 1500,
    "currency": "usd",
    "quantity": 1,
    "name": "Premium Pack"
  }],
  "successUrl": "https://yourdomain.com/success",
  "cancelUrl": "https://yourdomain.com/cancel"
}
```

#### Crear Cuenta Conectada (Marketplace)

```http
POST /api/payment/connect/account
Authorization: Bearer {token}
Content-Type: application/json

{
  "businessName": "Dance Studio XYZ",
  "email": "studio@example.com",
  "country": "US"
}
```

#### Pago Marketplace con Comisión

```http
POST /api/payment/marketplace
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 5000,
  "currency": "USD",
  "connectedAccountId": "acct_xxxxx",
  "platformFeePercentage": 10,
  "description": "Class booking"
}
```

## Webhooks

### Configuración

1. En Stripe Dashboard, ir a Developers > Webhooks
2. Agregar endpoint: `https://yourdomain.com/api/payment/webhook`
3. Seleccionar eventos a escuchar
4. Copiar el Webhook Secret al `.env`

### Eventos Soportados

-   `payment_intent.succeeded` - Pago completado
-   `payment_intent.failed` - Pago fallido
-   `customer.subscription.created` - Suscripción creada
-   `customer.subscription.updated` - Suscripción actualizada
-   `customer.subscription.deleted` - Suscripción cancelada
-   `invoice.paid` - Factura pagada
-   `invoice.payment_failed` - Pago de factura fallido
-   `account.updated` - Cuenta conectada actualizada

## Base de Datos

### Tablas Principales

-   `customers` - Clientes de Stripe vinculados a usuarios
-   `payment_intents` - Intenciones de pago
-   `subscriptions` - Suscripciones activas
-   `connected_accounts` - Cuentas conectadas para marketplace
-   `feature_packs` - Paquetes de características disponibles
-   `user_features` - Características compradas por usuario
-   `webhook_events` - Log de eventos de webhook

## Seguridad

-   ✅ Autenticación JWT requerida
-   ✅ Validación de webhooks con firma de Stripe
-   ✅ Idempotencia de eventos de webhook
-   ✅ Encriptación de datos sensibles
-   ✅ Rate limiting en endpoints

## Testing

```bash
# Usar el archivo HTTP para tests manuales
# Ver: scripts/test-payment-flows.http

# Crear datos de prueba
pnpm tsx scripts/setup-payment-test-data.ts

# Usar Stripe CLI para webhook local testing
stripe listen --forward-to localhost:3000/api/payment/webhook
```

## Casos de Uso Comunes

### 1. Sistema de Membresías

```typescript
// Verificar acceso premium
const hasAccess = await paymentFacade.hasActiveSubscription(userId);

if (hasAccess) {
    // Dar acceso a contenido premium
}
```

### 2. Venta de Clases por Profesores (Marketplace)

```typescript
// 1. Profesor crea cuenta conectada
const account = await createConnectedAccountHandler.execute({...});

// 2. Alumno paga por clase (10% va a la plataforma)
const payment = await createMarketplacePaymentHandler.execute({
    amount: 5000,
    connectedAccountId: teacher.stripeAccountId,
    platformFeePercentage: 10
});
```

### 3. Feature Flags Premium

```typescript
// Usuario compra pack de características
const pack = await purchaseFeaturePack(userId, packId);

// Verificar si tiene feature habilitado
const hasFeature = await checkUserFeature(userId, 'advanced_analytics');
```

## Mejores Prácticas

1. **Siempre usar EnsureCustomerHandler** antes de crear pagos
2. **Procesar webhooks de forma asíncrona** para responder rápido a Stripe
3. **Guardar metadata** en cada transacción para trazabilidad
4. **Usar PaymentFacadeService** para operaciones comunes
5. **Implementar retry logic** para webhooks fallidos
6. **Logs detallados** de todas las operaciones de pago

## Soporte

Para más información sobre Stripe:

-   [Documentación Stripe](https://stripe.com/docs)
-   [API Reference](https://stripe.com/docs/api)
-   [Testing](https://stripe.com/docs/testing)
