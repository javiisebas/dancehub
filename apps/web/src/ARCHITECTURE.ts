/**
 * 🏗️ ARCHITECTURE OVERVIEW
 *
 * This project follows a feature-based architecture with clear separation of concerns.
 *
 * ## Directory Structure
 *
 * ```
 * src/
 * ├── app/                    # Next.js App Router - Pages and API routes
 * │   ├── [locale]/          # Internationalized routes
 * │   ├── api/               # API routes (NextAuth, etc.)
 * │   └── ...
 * │
 * ├── core/                   # Core application setup (singleton patterns, configs)
 * │   ├── config/            # App-wide configurations (axios, query-client)
 * │   ├── providers/         # Global providers (QueryProvider, AuthProvider, etc.)
 * │   ├── types/             # Global type definitions (next-auth.d.ts)
 * │   └── lib/               # Core library utilities
 * │
 * ├── features/               # Feature modules (self-contained business logic)
 * │   ├── auth/              # Authentication feature
 * │   │   ├── api/           # API service functions
 * │   │   ├── components/    # Feature-specific components
 * │   │   ├── hooks/         # React Query hooks (queries/mutations)
 * │   │   ├── schemas/       # Zod validation schemas
 * │   │   ├── types/         # Feature-specific types
 * │   │   └── index.ts       # Public API exports
 * │   └── ...                # Other features (user, settings, etc.)
 * │
 * └── shared/                 # Shared code across features
 *     ├── api/               # Generic API client
 *     ├── components/        # Reusable components
 *     │   ├── ui/            # shadcn/ui primitives
 *     │   ├── forms/         # Form components
 *     │   └── layout/        # Layout components
 *     ├── hooks/             # Reusable hooks
 *     ├── types/             # Shared TypeScript types
 *     └── utils/             # Utility functions (cn, format, validation, etc.)
 * ```
 *
 * ## Key Principles
 *
 * ### 1. Feature-Based Organization
 * - Each feature is self-contained with its own API, components, hooks, and types
 * - Features export a public API through index.ts
 * - Features can import from shared/ but not from other features/
 *
 * ### 2. TanStack Query for Server State
 * - All API calls use TanStack Query (React Query)
 * - Queries for data fetching, Mutations for data modification
 * - Centralized cache management and automatic refetching
 * - Query keys defined in hooks for easy invalidation
 *
 * ### 3. Type Safety
 * - Strict TypeScript configuration
 * - Zod for runtime validation and type inference
 * - NextAuth types properly extended
 * - No any types allowed
 *
 * ### 4. Clean Code Practices
 * - Single Responsibility Principle for functions and components
 * - Proper error handling with typed errors
 * - Consistent naming conventions
 * - No deeply nested code (max 3 levels)
 *
 * ## Naming Conventions
 *
 * ### Files
 * - Components: PascalCase.tsx (e.g., Button.tsx)
 * - Hooks: use-kebab-case.ts (e.g., use-auth-mutations.ts)
 * - Utils: kebab-case.ts (e.g., error-handler.ts)
 * - Types: kebab-case.type.ts (e.g., form-state.type.ts)
 * - Services: kebab-case.service.ts (e.g., auth.service.ts)
 *
 * ### Code
 * - Components: PascalCase (export const Button = ...)
 * - Hooks: camelCase starting with 'use' (export const useAuth = ...)
 * - Functions: camelCase (export const formatDate = ...)
 * - Constants: UPPER_SNAKE_CASE (export const MAX_ITEMS = 100)
 * - Types/Interfaces: PascalCase (export type User = {...})
 *
 * ## React Query Patterns
 *
 * ### Query Keys
 * ```typescript
 * export const authKeys = {
 *   all: ['auth'] as const,
 *   profile: () => [...authKeys.all, 'profile'] as const,
 *   user: (id: string) => [...authKeys.all, 'user', id] as const,
 * };
 * ```
 *
 * ### Queries
 * ```typescript
 * export const useProfile = () => {
 *   return useQuery({
 *     queryKey: authKeys.profile(),
 *     queryFn: authService.getProfile,
 *     staleTime: 1000 * 60 * 5, // 5 minutes
 *   });
 * };
 * ```
 *
 * ### Mutations
 * ```typescript
 * export const useLogin = () => {
 *   const router = useRouter();
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: authService.login,
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: authKeys.all });
 *       router.push('/dashboard');
 *     },
 *   });
 * };
 * ```
 *
 * ## Form Handling
 *
 * ### With Zod + React Hook Form
 * ```typescript
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 *
 * const form = useFormWithSchema({ schema });
 * const loginMutation = useLogin();
 *
 * const onSubmit = form.handleSubmit((data) => {
 *   loginMutation.mutate(data);
 * });
 * ```
 *
 * ## Error Handling
 *
 * ### API Errors
 * ```typescript
 * try {
 *   await authService.login(credentials);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 *
 * ## Component Patterns
 *
 * ### Server Components (Default in App Router)
 * - Use for static content and data fetching on the server
 * - No client-side interactivity
 * - Better for SEO and initial load performance
 *
 * ### Client Components ('use client')
 * - Use for interactive components
 * - Required for hooks (useState, useEffect, etc.)
 * - Required for event handlers
 * - Keep as small as possible
 *
 * ## Best Practices
 *
 * 1. **Keep components small**: Max 200 lines, split if larger
 * 2. **Extract logic to hooks**: Business logic in custom hooks
 * 3. **Use composition**: Prefer composition over prop drilling
 * 4. **Type everything**: No implicit any types
 * 5. **Handle loading/error states**: Always handle async states
 * 6. **Use constants**: Extract magic numbers/strings to constants
 * 7. **Write meaningful names**: Self-documenting code over comments
 * 8. **Test critical paths**: Unit tests for utilities, E2E for flows
 *
 * ## Performance Optimization
 *
 * 1. **React Query cache**: Configure staleTime and gcTime appropriately
 * 2. **Code splitting**: Dynamic imports for large components
 * 3. **Image optimization**: Use next/image for all images
 * 4. **Memoization**: Use React.memo, useMemo, useCallback when needed
 * 5. **Bundle analysis**: Regular bundle size checks
 *
 * ## Development Workflow
 *
 * 1. Create feature branch: `feature/[feature-name]`
 * 2. Implement feature in features/ directory
 * 3. Add types and validation schemas
 * 4. Create React Query hooks
 * 5. Build components using hooks
 * 6. Test manually and with automated tests
 * 7. Run linter and type checker: `pnpm lint && pnpm check-types`
 * 8. Format code: `pnpm format`
 * 9. Create PR for review
 *
 * ## Adding New Features
 *
 * 1. Create feature directory: `features/[feature-name]/`
 * 2. Add subdirectories: `api/`, `components/`, `hooks/`, `types/`, `schemas/`
 * 3. Create service in `api/[feature-name].service.ts`
 * 4. Define types in `types/[feature-name].types.ts`
 * 5. Create validation schemas in `schemas/[feature-name].schemas.ts`
 * 6. Build React Query hooks in `hooks/`
 * 7. Create components in `components/`
 * 8. Export public API in `index.ts`
 *
 * ## Tech Stack
 *
 * - **Framework**: Next.js 15 (App Router)
 * - **Language**: TypeScript 5
 * - **UI Library**: React 19
 * - **Styling**: Tailwind CSS + shadcn/ui
 * - **State Management**: TanStack Query (Server State)
 * - **Forms**: React Hook Form + Zod
 * - **Auth**: NextAuth.js
 * - **HTTP Client**: Axios
 * - **i18n**: next-intl
 *
 * ## Environment Variables
 *
 * Required variables (add to .env.local):
 * ```
 * NEXT_PUBLIC_API_URL=http://localhost:3001
 * NEXTAUTH_URL=http://localhost:3000
 * NEXTAUTH_SECRET=your-secret-here
 * OAUTH_GOOGLE_ID=your-google-client-id
 * OAUTH_GOOGLE_SECRET=your-google-client-secret
 * FACEBOOK_CLIENT_ID=your-facebook-client-id
 * FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
 * ```
 */

export {};
