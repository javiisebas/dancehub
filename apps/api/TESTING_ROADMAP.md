# 🧪 Hoja de Ruta de Testing - DanceHub API

## 📋 Visión General

Sistema de testing completo para la API con tres niveles:

-   **Unit Tests**: Lógica de negocio aislada
-   **Integration Tests**: Interacción entre componentes
-   **E2E Tests**: Flujos completos de usuario

## 🎯 Objetivos

-   ✅ Cobertura mínima del 80%
-   ✅ Tests rápidos y confiables
-   ✅ CI/CD compatible
-   ✅ Documentación por tests
-   ✅ Fixtures y mocks reutilizables

---

## 📦 Fase 1: Configuración Base

### 1.1 Actualizar dependencias de testing

```bash
pnpm add -D @types/jest@latest jest@latest ts-jest@latest
pnpm add -D @nestjs/testing
pnpm add -D supertest @types/supertest
pnpm add -D testcontainers
```

### 1.2 Configurar Jest

Archivos a crear/actualizar:

-   `jest.config.ts` - Configuración principal
-   `test/jest-setup.ts` - Setup global
-   `test/jest-teardown.ts` - Cleanup global

### 1.3 Configurar Test Containers

Para tests E2E con PostgreSQL y Redis reales:

-   Docker compose para testing
-   Test containers para PostgreSQL
-   Test containers para Redis

### 1.4 Crear utilidades base

```
test/
├── utils/
│   ├── test-helpers.ts          # Helpers generales
│   ├── database-helper.ts       # DB seeding y cleanup
│   ├── auth-helper.ts           # Generación de tokens
│   └── faker-helper.ts          # Datos de prueba
├── fixtures/
│   ├── user.fixture.ts
│   ├── auth.fixture.ts
│   ├── payment.fixture.ts
│   └── dance-style.fixture.ts
└── mocks/
    ├── stripe.mock.ts
    ├── email.mock.ts
    └── storage.mock.ts
```

---

## 📦 Fase 2: Unit Tests

### 2.1 Core Modules

#### Cache Module

-   ✅ CacheService - get, set, delete, tags
-   ✅ RelationshipManager - invalidación automática
-   ✅ BaseCacheKey - generación de keys
-   ✅ CacheTags - gestión de tags

```typescript
// cache.service.spec.ts
describe('CacheService', () => {
    it('should store and retrieve values');
    it('should invalidate by tags');
    it('should handle TTL correctly');
});
```

#### Database Module

-   ✅ BaseRepository - CRUD operations
-   ✅ QueryBuilder - construcción de queries
-   ✅ UnitOfWork - transacciones
-   ✅ FieldMapper - mapeo de campos

#### Logger Module

-   ✅ LoggerService - diferentes niveles
-   ✅ ObservabilityService - métricas
-   ✅ TracingInterceptor - request tracking

### 2.2 Auth Module

#### Domain Layer

```typescript
// auth-token.service.spec.ts
describe('AuthTokenService', () => {
    it('should generate valid JWT tokens');
    it('should verify token signatures');
    it('should handle expired tokens');
    it('should generate refresh tokens');
});

// auth-password.service.spec.ts
describe('AuthPasswordService', () => {
    it('should hash passwords with argon2');
    it('should verify password hashes');
    it('should reject weak passwords');
});
```

#### Application Layer

```typescript
// login.handler.spec.ts
describe('LoginHandler', () => {
    it('should login with valid credentials');
    it('should reject invalid credentials');
    it('should return access and refresh tokens');
    it('should update last login timestamp');
});

// register.handler.spec.ts
describe('RegisterHandler', () => {
    it('should create new user');
    it('should hash password');
    it('should send verification email');
    it('should reject duplicate emails');
});
```

### 2.3 Payment Module

#### Domain Layer

```typescript
// payment-intent.entity.spec.ts
describe('PaymentIntent Entity', () => {
    it('should create payment intent');
    it('should update status');
    it('should validate transitions');
    it('should calculate refundable amount');
});

// subscription.entity.spec.ts
describe('Subscription Entity', () => {
    it('should create subscription');
    it('should cancel at period end');
    it('should cancel immediately');
    it('should check if active');
});
```

#### Application Layer

```typescript
// create-payment-intent.handler.spec.ts
describe('CreatePaymentIntentHandler', () => {
    it('should create payment intent with Stripe');
    it('should create customer if not exists');
    it('should save payment to database');
    it('should handle Stripe errors');
});

// webhook.handler.spec.ts
describe('WebhookHandler', () => {
    it('should process payment_intent.succeeded');
    it('should process subscription.updated');
    it('should ignore duplicate events');
    it('should retry failed events');
});
```

### 2.4 User Module

```typescript
// user.entity.spec.ts
describe('User Entity', () => {
    it('should create user with valid data');
    it('should validate email format');
    it('should check verification status');
    it('should handle password updates');
});

// create-user.handler.spec.ts
describe('CreateUserHandler', () => {
    it('should create user successfully');
    it('should reject duplicate emails');
    it('should trigger email verification');
});
```

---

## 📦 Fase 3: Integration Tests

### 3.1 Database Integration

```typescript
// user.repository.integration.spec.ts
describe('UserRepository Integration', () => {
    beforeAll(/* setup test database */);
    afterAll(/* cleanup */);

    it('should save and retrieve users');
    it('should find by email');
    it('should update user data');
    it('should handle transactions');
});
```

### 3.2 Cache Integration

```typescript
// cache-repository.integration.spec.ts
describe('Cache + Repository Integration', () => {
    it('should cache query results');
    it('should invalidate on updates');
    it('should handle cache misses');
    it('should batch queries');
});
```

### 3.3 Auth Flow Integration

```typescript
// auth-flow.integration.spec.ts
describe('Auth Flow Integration', () => {
    it('should complete full registration flow');
    it('should complete email verification');
    it('should handle password reset');
    it('should refresh tokens');
});
```

### 3.4 Payment Flow Integration

```typescript
// payment-flow.integration.spec.ts
describe('Payment Flow Integration', () => {
    it('should create customer on first payment');
    it('should process one-time payment');
    it('should create and activate subscription');
    it('should handle failed payments');
    it('should process refunds');
});
```

### 3.5 Webhook Integration

```typescript
// webhook-flow.integration.spec.ts
describe('Webhook Flow Integration', () => {
    it('should verify webhook signatures');
    it('should process events in order');
    it('should handle event idempotency');
    it('should log all webhook events');
});
```

---

## 📦 Fase 4: E2E Tests

### 4.1 Setup E2E Environment

```typescript
// test/e2e/setup.ts
export class E2ETestEnvironment {
    app: INestApplication;
    db: DatabaseService;
    redis: Redis;

    async setup() {
        // Start testcontainers
        // Run migrations
        // Seed basic data
    }

    async teardown() {
        // Cleanup database
        // Stop containers
    }
}
```

### 4.2 Auth E2E

```typescript
// auth.e2e.spec.ts
describe('Auth E2E', () => {
    it('POST /auth/register - should register new user');
    it('POST /auth/login - should login successfully');
    it('POST /auth/refresh - should refresh token');
    it('POST /auth/logout - should logout');
    it('POST /auth/verify-email - should verify email');
    it('POST /auth/forgot-password - should send reset email');
    it('POST /auth/reset-password - should reset password');
    it('GET /auth/me - should return current user');
});
```

### 4.3 Payment E2E

```typescript
// payment.e2e.spec.ts
describe('Payment E2E', () => {
    it('POST /payment/intent - should create payment intent');
    it('POST /payment/subscription - should create subscription');
    it('POST /payment/subscription/:id/cancel - should cancel');
    it('POST /payment/checkout - should create checkout session');
    it('POST /payment/connect/account - should create connected account');
    it('POST /payment/marketplace - should process marketplace payment');
    it('POST /payment/webhook - should handle webhooks');
});
```

### 4.4 User E2E

```typescript
// user.e2e.spec.ts
describe('User E2E', () => {
    it('POST /users - should create user');
    it('GET /users - should paginate users');
    it('GET /users/:id - should get user by id');
    it('PATCH /users/:id - should update user');
    it('DELETE /users/:id - should delete user');
});
```

### 4.5 Protected Routes E2E

```typescript
// protected-routes.e2e.spec.ts
describe('Protected Routes E2E', () => {
    it('should reject requests without token');
    it('should reject requests with invalid token');
    it('should reject requests with expired token');
    it('should allow requests with valid token');
    it('should handle refresh token flow');
});
```

---

## 📦 Fase 5: Performance & Load Tests

### 5.1 Performance Tests

```typescript
// performance.spec.ts
describe('Performance Tests', () => {
    it('should handle 100 concurrent requests');
    it('should respond under 200ms');
    it('should cache frequently accessed data');
    it('should batch database queries');
});
```

### 5.2 Load Tests

```bash
# Usando Artillery o k6
artillery run test/load/payment-flow.yml
k6 run test/load/auth-flow.js
```

---

## 📦 Fase 6: Testing Utilities

### 6.1 Test Factories

```typescript
// factories/user.factory.ts
export class UserFactory {
    static create(overrides?: Partial<User>): User;
    static createMany(count: number): User[];
    static createWithSubscription(): User;
}

// factories/payment.factory.ts
export class PaymentFactory {
    static createIntent(overrides?): PaymentIntent;
    static createSubscription(overrides?): Subscription;
    static createWebhookEvent(type: string): WebhookEvent;
}
```

### 6.2 Test Builders

```typescript
// builders/request.builder.ts
export class RequestBuilder {
    withAuth(user: User): this;
    withBody(body: any): this;
    withQuery(query: any): this;
    build(): SuperTest;
}
```

### 6.3 Custom Matchers

```typescript
// matchers/custom-matchers.ts
expect.extend({
    toBeValidUUID(received) {},
    toBeValidEmail(received) {},
    toHaveValidJWT(received) {},
    toMatchStripeEvent(received, expected) {},
});
```

---

## 📦 Fase 7: CI/CD Integration

### 7.1 GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
    unit:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - run: pnpm install
            - run: pnpm test:unit

    integration:
        runs-on: ubuntu-latest
        services:
            postgres:
                image: postgres:16
            redis:
                image: redis:7
        steps:
            - run: pnpm test:integration

    e2e:
        runs-on: ubuntu-latest
        steps:
            - run: pnpm test:e2e

    coverage:
        runs-on: ubuntu-latest
        steps:
            - run: pnpm test:cov
            - uses: codecov/codecov-action@v3
```

### 7.2 Scripts en package.json

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:cov": "jest --coverage",
        "test:unit": "jest --testPathPattern=\\.spec\\.ts$",
        "test:integration": "jest --testPathPattern=\\.integration\\.spec\\.ts$",
        "test:e2e": "jest --config ./test/jest-e2e.json",
        "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
    }
}
```

---

## 📦 Fase 8: Métricas y Reporting

### 8.1 Coverage Reports

-   Istanbul/NYC para cobertura
-   SonarQube para calidad de código
-   Codecov para tracking de coverage

### 8.2 Test Reports

-   Jest HTML Reporter
-   Allure Report para E2E
-   Performance metrics dashboard

---

## 🚀 Orden de Implementación Recomendado

### Semana 1: Setup y Core

1. ✅ Configurar Jest y dependencias
2. ✅ Crear utilidades y fixtures base
3. ✅ Tests unitarios de Cache Module
4. ✅ Tests unitarios de Database Module
5. ✅ Tests unitarios de Logger Module

### Semana 2: Auth Module

1. ✅ Unit tests de Auth Domain
2. ✅ Unit tests de Auth Application
3. ✅ Integration tests de Auth
4. ✅ E2E tests de Auth

### Semana 3: Payment Module

1. ✅ Unit tests de Payment Domain
2. ✅ Unit tests de Payment Application
3. ✅ Integration tests de Payment
4. ✅ E2E tests de Payment
5. ✅ Webhook testing completo

### Semana 4: User y Core Features

1. ✅ Unit tests de User Module
2. ✅ Integration tests de User
3. ✅ E2E tests de User
4. ✅ Tests de DanceStyle Module

### Semana 5: Integration y E2E Completo

1. ✅ Tests de integración entre módulos
2. ✅ Flujos E2E complejos
3. ✅ Tests de seguridad
4. ✅ Performance tests

### Semana 6: CI/CD y Optimización

1. ✅ Configurar CI/CD
2. ✅ Optimizar tests lentos
3. ✅ Documentación de testing
4. ✅ Revisión de cobertura

---

## 📚 Best Practices

### Testing Principles

-   AAA Pattern: Arrange, Act, Assert
-   Tests independientes y deterministas
-   Un test, una responsabilidad
-   Nombres descriptivos de tests
-   Evitar lógica en tests

### Mocking Strategy

-   Mock servicios externos (Stripe, Email, Storage)
-   Use real database en integration tests
-   Mock time/dates para tests deterministas
-   Spy en lugar de Mock cuando sea posible

### Data Management

-   Factories para crear datos de prueba
-   Cleanup entre tests
-   Transactions para tests de DB
-   Fixtures para datos complejos

### Performance

-   Tests paralelos cuando sea posible
-   Cache de builds en CI
-   Testcontainers con volúmenes
-   Optimizar setup/teardown

---

## ✅ Checklist de Implementación

### Unit Tests

-   [ ] Cache Service
-   [ ] Database Base Repository
-   [ ] Auth Token Service
-   [ ] Auth Password Service
-   [ ] Login Handler
-   [ ] Register Handler
-   [ ] Payment Intent Entity
-   [ ] Subscription Entity
-   [ ] Create Payment Handler
-   [ ] Webhook Handler
-   [ ] User Entity
-   [ ] Create User Handler

### Integration Tests

-   [ ] Repository + Database
-   [ ] Repository + Cache
-   [ ] Auth Full Flow
-   [ ] Payment Full Flow
-   [ ] Webhook Processing

### E2E Tests

-   [ ] Auth Endpoints
-   [ ] Payment Endpoints
-   [ ] User Endpoints
-   [ ] Protected Routes
-   [ ] Error Scenarios

### Infrastructure

-   [ ] Jest Configuration
-   [ ] Test Containers Setup
-   [ ] CI/CD Pipeline
-   [ ] Coverage Reporting
-   [ ] Performance Tests

---

## 🎓 Recursos

-   [NestJS Testing Docs](https://docs.nestjs.com/fundamentals/testing)
-   [Jest Documentation](https://jestjs.io/docs/getting-started)
-   [Testcontainers](https://testcontainers.com/)
-   [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## 🔜 Próximos Pasos

Una vez completado el testing:

1. Implementar Swagger completo para la API
2. Agregar rate limiting avanzado
3. Implementar feature flags
4. Crear dashboard de métricas
5. Documentación de API con ejemplos
