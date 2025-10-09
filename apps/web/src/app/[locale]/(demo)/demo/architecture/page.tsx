'use client';

import { Icon } from '@iconify/react';
import { Button } from '@repo/ui/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { Separator } from '@repo/ui/components/separator';
import { usersService } from '@web/features/users/api/users.service';
import { cached, globalCache, QueryBuilder, withRetry } from '@web/lib/api';
import { useApiMutation, useApiQuery } from '@web/lib/hooks';
import Link from 'next/link';
import { useState } from 'react';

export default function ArchitectureDemoPage() {
    const [userId, setUserId] = useState<string>('');
    const [queryBuilderDemo, setQueryBuilderDemo] = useState<string>('');

    // Example 1: Using new API Query hook with automatic error handling
    const {
        data: users,
        isLoading,
        refetch,
    } = useApiQuery(
        ['users-demo', { page: 1, limit: 5 }],
        () => usersService.paginate({ page: 1, limit: 5 }),
        {
            enabled: false, // Manual trigger
            showErrorToast: true,
        },
    );

    // Example 2: Using mutation with success message
    const { mutate: createUser, isPending: isCreating } = useApiMutation(
        (data: Parameters<typeof usersService.create>[0]) => usersService.create(data),
        {
            showSuccessToast: true,
            successMessage: 'User created successfully!',
            invalidateQueries: [['users-demo']],
        },
    );

    // Example 3: Query Builder Demo
    const demoQueryBuilder = () => {
        const query = QueryBuilder.create()
            .addPagination(1, 10)
            .addSort({ createdAt: 'desc', name: 'asc' })
            .addSearch('john', ['name', 'email'])
            .addFilter({ status: 'active', role: 'user' })
            .addDateRange(new Date('2024-01-01'), new Date('2024-12-31'))
            .build();

        setQueryBuilderDemo(query);
    };

    // Example 4: Cached Request Demo
    const cachedFetchUser = cached(
        async (id: string) => {
            console.log('Fetching user from API (not cached):', id);
            return usersService.getById(id);
        },
        {
            ttl: 60000, // 1 minute
            keyGenerator: (id) => `user:${id}`,
        },
    );

    const handleCachedRequest = async () => {
        if (!userId) return;

        // First call: hits API
        await cachedFetchUser(userId);

        // Second call: from cache (check console)
        await cachedFetchUser(userId);

        alert('Check console - second call was cached!');
    };

    // Example 5: Retry Logic Demo
    const handleRetryDemo = async () => {
        try {
            await withRetry(
                async () => {
                    // Simulate API call that might fail
                    const random = Math.random();
                    if (random < 0.7) {
                        throw new Error('Simulated API failure');
                    }
                    return 'Success!';
                },
                {
                    maxAttempts: 3,
                    delayMs: 1000,
                    backoff: true,
                },
            );
            alert('Request succeeded!');
        } catch (error) {
            alert('Request failed after 3 attempts');
        }
    };

    // Example 6: Cache Management Demo
    const handleCacheManagement = () => {
        // Set cache
        globalCache.set('demo-key', { data: 'example' }, 5000);

        // Get cache
        const cached = globalCache.get('demo-key');
        console.log('Cached data:', cached);

        // Invalidate pattern
        globalCache.invalidatePattern(/^user:/);

        // Check cache size
        alert(`Cache size: ${globalCache.size} entries`);
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
                <h1 className="text-4xl font-bold tracking-tight">Architecture Demo</h1>
                <p className="text-xl text-muted-foreground">
                    Nueva arquitectura escalable con BaseApiService, Error Handling y más
                </p>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Example 1: API Query Hook */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon icon="mdi:api" className="h-5 w-5" />
                            API Query Hook
                        </CardTitle>
                        <CardDescription>useApiQuery with automatic error handling</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={() => refetch()} loading={isLoading} className="w-full">
                            <Icon icon="mdi:refresh" className="mr-2 h-4 w-4" />
                            Fetch Users
                        </Button>

                        {users && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Results: {users.data?.length || 0} users
                                </p>
                                <div className="rounded-lg border bg-muted/50 p-3">
                                    <pre className="overflow-auto text-xs">
                                        {JSON.stringify(users, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <p className="font-mono text-xs">
                                useApiQuery(['users'], () =&gt; service.paginate(...))
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Example 2: API Mutation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon icon="mdi:pencil" className="h-5 w-5" />
                            API Mutation
                        </CardTitle>
                        <CardDescription>useApiMutation with success toast</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={() =>
                                createUser({
                                    name: 'John Doe',
                                    email: 'john@example.com',
                                })
                            }
                            loading={isCreating}
                            className="w-full"
                        >
                            <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
                            Create User (Demo)
                        </Button>

                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                                ✓ Automatic success toast
                            </p>
                            <p className="text-xs text-muted-foreground">
                                ✓ Automatic error handling
                            </p>
                            <p className="text-xs text-muted-foreground">✓ Query invalidation</p>
                        </div>

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <p className="font-mono text-xs">
                                useApiMutation(() =&gt; service.create(...), {'{'} showSuccessToast
                                {'}'})
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Example 3: Query Builder */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon icon="mdi:link-variant" className="h-5 w-5" />
                            Query Builder
                        </CardTitle>
                        <CardDescription>Fluent API for building query strings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={demoQueryBuilder} className="w-full">
                            <Icon icon="mdi:cog" className="mr-2 h-4 w-4" />
                            Build Query
                        </Button>

                        {queryBuilderDemo && (
                            <div className="rounded-lg border bg-muted/50 p-3">
                                <p className="break-all font-mono text-xs">{queryBuilderDemo}</p>
                            </div>
                        )}

                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>• Pagination</p>
                            <p>• Sorting</p>
                            <p>• Filtering</p>
                            <p>• Search</p>
                            <p>• Date ranges</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Example 4: Caching */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon icon="mdi:cached" className="h-5 w-5" />
                            Request Caching
                        </CardTitle>
                        <CardDescription>TTL-based caching with decorators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="User ID"
                                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
                            />
                            <Button onClick={handleCachedRequest} disabled={!userId}>
                                <Icon icon="mdi:play" className="mr-2 h-4 w-4" />
                                Test
                            </Button>
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>1. Enter a user ID</p>
                            <p>2. Click Test (fetches from API)</p>
                            <p>3. Click again (returns from cache)</p>
                            <p>4. Check console logs</p>
                        </div>

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <p className="font-mono text-xs">
                                cached(fn, {'{'} ttl: 60000 {'}'})
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Example 5: Retry Logic */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon icon="mdi:refresh-circle" className="h-5 w-5" />
                            Retry Logic
                        </CardTitle>
                        <CardDescription>Exponential backoff for failed requests</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleRetryDemo} className="w-full">
                            <Icon icon="mdi:reload" className="mr-2 h-4 w-4" />
                            Simulate Retry (70% fail rate)
                        </Button>

                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>• Max 3 attempts</p>
                            <p>• Exponential backoff (1s, 2s, 4s)</p>
                            <p>• Automatic retry on 5xx errors</p>
                            <p>• Configurable retry conditions</p>
                        </div>

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <p className="font-mono text-xs">
                                withRetry(() =&gt; apiCall(), {'{'} maxAttempts: 3 {'}'})
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Example 6: Cache Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Icon icon="mdi:database" className="h-5 w-5" />
                            Cache Management
                        </CardTitle>
                        <CardDescription>Manual cache control and invalidation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleCacheManagement} className="w-full">
                            <Icon icon="mdi:cog-outline" className="mr-2 h-4 w-4" />
                            Cache Operations
                        </Button>

                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>• Set/Get cache entries</p>
                            <p>• Pattern-based invalidation</p>
                            <p>• Automatic cleanup</p>
                            <p>• TTL management</p>
                        </div>

                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <p className="font-mono text-xs">
                                globalCache.invalidatePattern(/^user:/)
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Documentation Link */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle>📚 Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        Consulta{' '}
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                            ARCHITECTURE_IMPROVEMENTS.md
                        </code>{' '}
                        para documentación completa.
                    </p>
                    <div className="space-y-1 text-muted-foreground">
                        <p>✓ BaseApiService: Clase base para todos los servicios</p>
                        <p>✓ Error Handling: Sistema centralizado de errores</p>
                        <p>✓ Query Builder: Construcción fluida de queries</p>
                        <p>✓ Request Cache: Caching con TTL</p>
                        <p>✓ API Hooks: Wrappers de React Query</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
