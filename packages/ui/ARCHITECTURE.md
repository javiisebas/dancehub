# UI Package Architecture

## Overview

`@repo/ui` is a shared component library designed for use across multiple Next.js applications in this monorepo.

## Key Principles

### 1. **Independence from Backend Types**

The UI package is completely independent of backend-specific code:

-   **No class-validator decorators**: Backend DTOs with decorators stay in `@repo/shared`
-   **Simple types only**: UI-specific types are defined locally (e.g., `SortField`, `SortOrder` in `types/data-table.types.ts`)
-   **Browser compatibility**: All types and utilities work in both Node.js and browser environments

### 2. **SSR-Safe by Default**

Components are organized to prevent SSR errors:

-   **Standard components**: Safe for SSR (exported from `components/index.ts`)
-   **Client-only components**: Require DOM APIs (exported from `components/client-only.ts`)
-   **Clear documentation**: Comments indicate when dynamic imports are needed

### 3. **Tree-Shakeable Exports**

Package exports are structured for optimal tree-shaking:

```json
{
    "./components": "./src/components/index.ts",
    "./components/client-only": "./src/components/client-only.ts",
    "./components/data-table": "./src/components/data-table/index.ts",
    "./hooks": "./src/hooks/index.ts",
    "./utils": "./src/utils/index.ts",
    "./types": "./src/types/index.ts"
}
```

## Directory Structure

```
src/
├── components/
│   ├── index.ts                 # Main exports (SSR-safe)
│   ├── client-only.ts          # Client-only components
│   ├── data-table/             # Feature-specific components
│   ├── rich-text-editor/
│   └── feedback/
├── hooks/                      # Reusable React hooks
├── types/                      # Shared TypeScript types
├── utils/                      # Utility functions
└── styles/                     # Global styles
```

## Data Table Types

The data table functionality requires `SortField` and `SortOrder` types. These are defined locally in `types/data-table.types.ts` rather than imported from `@repo/shared` to avoid pulling in backend-specific DTOs with decorators.

```typescript
// ❌ BAD: Would pull in class-validator decorators
import { SortField, SortOrder } from '@repo/shared';

// ✅ GOOD: Simple types without decorators
import { SortField, SortOrder } from '@repo/ui/types';
```

## Best Practices

### For Component Authors

1. Mark client-only components with `'use client'` directive
2. Document component props with TypeScript types
3. Export types alongside components
4. Avoid importing from `@repo/shared` (use local types instead)

### For Component Consumers

1. Import standard components from `@repo/ui/components`
2. Use dynamic imports for client-only components
3. Import utilities from `@repo/ui/utils`
4. Import types from `@repo/ui/types` or specific component exports

## Migration Guide

If you encounter SSR errors with existing components:

1. Check if component uses DOM APIs (window, document, etc.)
2. Move component import to use `@repo/ui/components/client-only`
3. Wrap with dynamic import and `{ ssr: false }`

See `CLIENT_ONLY_COMPONENTS.md` for detailed instructions.
