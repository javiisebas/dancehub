'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { UsersTable } from '@web/features/users';
import { UsersTableAdvanced } from '@web/features/users/components/users-table-advanced';

export default function TablesExamplePage() {
    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Data Tables</h1>
                <p className="mt-2 text-muted-foreground">
                    Professional, scalable tables with pagination, sorting, and filtering
                </p>
            </div>

            <Tabs defaultValue="basic" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="basic">Basic Table</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Filtering</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users Table</CardTitle>
                            <CardDescription>
                                Server-side pagination and sorting with TanStack Table
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UsersTable />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users Table with Filtering</CardTitle>
                            <CardDescription>
                                Advanced example with search and filter capabilities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UsersTableAdvanced />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
