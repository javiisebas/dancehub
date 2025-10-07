# CLI Testing Guide

## Test Cases

### 1. Simple Module (No Fields)

```bash
cd apps/api
pnpm generate module --name category
```

### 2. Module with Inline Fields

```bash
cd apps/api
pnpm generate module --name product --fields "name:varchar(255):required,price:integer:required,stock:integer"
```

### 3. Module with Schema File

```bash
cd apps/api
pnpm generate module --name order --schema scripts/cli/examples/order-schema.json
```

### 4. Translatable Module with Schema

```bash
cd apps/api
pnpm generate module --name venue --translatable --schema scripts/cli/examples/venue-schema.json
```

### 5. Container Module

```bash
cd apps/api
pnpm generate module-container --name commerce
```

### 6. Entity in Existing Module

```bash
cd apps/api
pnpm generate entity --module commerce --name product --schema scripts/cli/examples/product-schema.json
```

### 7. Custom Handler

```bash
cd apps/api
pnpm generate handler --module user --type command --name verify-email
```

### 8. Domain Service

```bash
cd apps/api
pnpm generate service --module user --layer domain --name password-hasher
```

## Features to Test

-   ✅ Inline fields parsing
-   ✅ JSON schema files
-   ✅ Enum generation in packages/shared
-   ✅ Foreign keys
-   ✅ Relations
-   ✅ Translatable modules
-   ✅ Container modules
-   ✅ Custom handlers
-   ✅ Services
-   ✅ Auto-formatting with Prettier
-   ✅ Auto-registration in app.module.ts
-   ✅ Auto-registration in schema.ts
-   ✅ DTOs generation in packages/shared

## Expected Output Structure

```
apps/api/src/modules/product/
├── product.module.ts
├── domain/
│   ├── entities/
│   │   └── product.entity.ts
│   └── repositories/
│       └── i-product.repository.ts
├── application/
│   ├── commands/
│   │   ├── create-product.handler.ts
│   │   ├── update-product.handler.ts
│   │   └── delete-product.handler.ts
│   └── queries/
│       ├── get-product-by-field.handler.ts
│       ├── find-many-products.handler.ts
│       └── get-paginated-products.handler.ts
└── infrastructure/
    ├── controllers/
    │   └── product.controller.ts
    ├── repositories/
    │   └── product.repository.ts
    ├── schemas/
    │   └── product.schema.ts
    └── cache/
        └── product.cache-keys.ts

packages/shared/src/dtos/product/
├── request/
│   ├── create-product.request.ts
│   ├── update-product.request.ts
│   ├── paginate-product.request.ts
│   └── index.ts
├── response/
│   ├── product.response.ts
│   ├── product-paginated.response.ts
│   └── index.ts
├── types/
│   ├── product-field.type.ts
│   └── index.ts
└── index.ts

packages/shared/src/enums/
└── product-status.enum.ts (if enums defined)
```

## Validation Checklist

-   [ ] All files generated correctly
-   [ ] No TypeScript errors
-   [ ] Proper imports
-   [ ] Module registered in app.module.ts
-   [ ] Schemas exported in schema.ts
-   [ ] DTOs exported in packages/shared
-   [ ] Enums created if specified
-   [ ] Relations configured correctly
-   [ ] Foreign keys defined
-   [ ] Code formatted with Prettier
-   [ ] Repository uses defineRelations for relations
-   [ ] Query handlers extend base handlers
-   [ ] Controllers follow standard pattern
