# DanceHub CLI Guide

CLI tool for generating modules, entities, handlers and services.

## Overview

Features:

-   Translatable and non-translatable modules
-   Inline fields or JSON schema files
-   Entity relationships
-   Automatic enums in `packages/shared`
-   Foreign keys
-   Auto-formatting with Prettier
-   Auto-registration in app.module.ts and schema.ts

## Usage

```bash
# View help
cd apps/api && pnpm generate

# Generate simple module
cd apps/api && pnpm generate module --name product

# Generate module with inline fields
cd apps/api && pnpm generate module --name product --fields "name:varchar(255):required,price:integer:required"

# Generate module with JSON schema
cd apps/api && pnpm generate module --name product --schema scripts/cli/examples/product-schema.json

# Generate translatable module
cd apps/api && pnpm generate module --name venue --translatable --schema scripts/cli/examples/venue-schema.json
```

## Schema File Format

### Basic Example (product-schema.json)

```json
{
    "fields": {
        "name": "varchar('name', { length: 255 }).notNull()",
        "description": "text('description')",
        "price": "decimal('price', { precision: 10, scale: 2 }).notNull()",
        "stock": "integer('stock').notNull()",
        "isActive": "boolean('is_active').notNull()",
        "sku": "varchar('sku', { length: 100 }).notNull().unique()"
    },
    "enums": [
        {
            "name": "ProductStatus",
            "values": ["draft", "published", "archived"]
        }
    ]
}
```

### Advanced Example with Relations (order-schema.json)

```json
{
    "fields": {
        "orderNumber": "varchar('order_number', { length: 50 }).notNull().unique()",
        "total": "decimal('total', { precision: 10, scale: 2 }).notNull()",
        "status": "varchar('status', { length: 50 }).notNull()"
    },
    "foreignKeys": [
        {
            "name": "userId",
            "refTable": "users",
            "onDelete": "cascade"
        }
    ],
    "relations": {
        "user": {
            "type": "manyToOne",
            "entity": "User",
            "table": "users",
            "foreignKey": "userId"
        },
        "items": {
            "type": "oneToMany",
            "entity": "OrderItem",
            "table": "orderItems",
            "references": "orderId"
        }
    },
    "enums": [
        {
            "name": "OrderStatus",
            "values": ["pending", "processing", "shipped", "delivered", "cancelled"]
        }
    ]
}
```

## Inline Fields Format

```bash
# Format: "field1:type:modifiers,field2:type:modifiers"
# Types: varchar(length), integer, text, boolean, timestamp, uuid, decimal
# Modifiers: required, unique

--fields "name:varchar(255):required,email:varchar(255):required:unique,age:integer"
```

## Generated Structure

### Non-Translatable Module

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
│   └── paginate-product.request.ts
├── response/
│   ├── product.response.ts
│   └── product-paginated.response.ts
└── types/
    └── product-field.type.ts
```

## Features

### Type-Safe Fields

```typescript
// Auto-generated from schema
export type ProductField = InferFields<typeof productSchema>;
```

### Automatic Relations

```typescript
// In repository
const productRelations = defineRelations({
    category: relation.manyToOne({
        entity: Category,
        table: categories,
        foreignKey: 'categoryId',
    }),
});
```

### Enum Generation

Enums are automatically created in `packages/shared/src/enums/`:

```typescript
// packages/shared/src/enums/product-status.enum.ts
export enum ProductStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}
```

### Validation

Auto-generated validators based on field types:

```typescript
@IsString({ message: 'name must be a string' })
@IsNotEmpty({ message: 'name cannot be empty' })
@MaxLength(255, { message: 'name cannot exceed 255 characters' })
name: string;
```

### CQRS Handlers

Three powerful base queries for all operations:

-   `GetByFieldHandler` - Find by any field (id, slug, email, etc.)
-   `FindManyHandler` - Find many with filters and limit
-   `GetPaginatedHandler` - Paginated results with full filtering

## Workflow

1. **Create Schema File** (optional)

    ```bash
    cd apps/api/scripts/cli/examples
    nano my-entity-schema.json
    ```

2. **Generate Module**

    ```bash
    cd apps/api
    pnpm generate module --name my-entity --schema scripts/cli/examples/my-entity-schema.json
    ```

3. **Review Generated Files**

    - Check `src/modules/my-entity/`
    - Check `packages/shared/src/dtos/my-entity/`
    - Check `packages/shared/src/enums/` (if enums defined)

4. **Run Migrations**

    ```bash
    pnpm db:push
    ```

5. **Start Server**
    ```bash
    pnpm start
    ```

## Tips

1. **Use kebab-case** for all names: `dance-style`, not `DanceStyle`
2. **Schema files** can be `.json` or `.js` (must export object)
3. **Enums** are auto-created in `packages/shared/src/enums`
4. **Relations** are auto-configured in repositories
5. **Code** is auto-formatted with Prettier
6. **All files** follow established architecture patterns

## Troubleshooting

### Module Already Exists

```bash
# Remove existing module
rm -rf src/modules/my-module
rm -rf ../../packages/shared/src/dtos/my-module

# Restore modified files
git restore src/app.module.ts src/modules/core/database/schema.ts packages/shared/src/dtos/index.ts
```

### Schema Parse Error

-   Verify JSON syntax
-   Check field definitions match Drizzle format
-   Ensure enum values are strings

### Type Errors

-   Run `pnpm build` to check for TypeScript errors
-   Verify imports in generated files
-   Check that related entities exist
