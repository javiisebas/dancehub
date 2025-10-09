/**
 * 📖 EJEMPLO COMPLETO: Cómo crear un nuevo feature
 *
 * Este archivo muestra paso a paso cómo implementar un feature completo
 * siguiendo la nueva arquitectura.
 *
 * ## Ejemplo: Feature de "Posts"
 *
 * Vamos a crear un feature que permita:
 * - Listar posts
 * - Ver detalle de un post
 * - Crear un nuevo post
 * - Editar un post
 * - Eliminar un post
 */

/**
 * PASO 1: Crear estructura de carpetas
 * =====================================
 *
 * mkdir -p src/features/posts/{api,components,hooks,schemas,types}
 */

/**
 * PASO 2: Definir tipos
 * ======================
 * File: src/features/posts/types/post.types.ts
 */
/*
export interface Post {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostRequest {
    title: string;
    content: string;
}

export interface UpdatePostRequest {
    title?: string;
    content?: string;
}

export interface PostsResponse {
    posts: Post[];
    total: number;
    page: number;
    pageSize: number;
}
*/

/**
 * PASO 3: Crear schemas de validación
 * ====================================
 * File: src/features/posts/schemas/post.schemas.ts
 */
/*
import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),
    content: z.string()
        .min(10, 'Content must be at least 10 characters')
        .max(5000, 'Content must be less than 5000 characters'),
});

export const updatePostSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
        .optional(),
    content: z.string()
        .min(10, 'Content must be at least 10 characters')
        .max(5000, 'Content must be less than 5000 characters')
        .optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
*/

/**
 * PASO 4: Crear servicio de API
 * ==============================
 * File: src/features/posts/api/posts.service.ts
 */
/*
import { apiClient } from '@web/shared/api';
import {
    Post,
    PostsResponse,
    CreatePostRequest,
    UpdatePostRequest,
} from '../types/post.types';

export const postsService = {
    // GET /posts
    getPosts: async (page: number = 1, pageSize: number = 10): Promise<PostsResponse> => {
        return apiClient.get<PostsResponse>(`/posts?page=${page}&pageSize=${pageSize}`);
    },

    // GET /posts/:id
    getPost: async (id: string): Promise<Post> => {
        return apiClient.get<Post>(`/posts/${id}`);
    },

    // POST /posts
    createPost: async (data: CreatePostRequest): Promise<Post> => {
        return apiClient.post<Post, CreatePostRequest>('/posts', data);
    },

    // PATCH /posts/:id
    updatePost: async (id: string, data: UpdatePostRequest): Promise<Post> => {
        return apiClient.patch<Post, UpdatePostRequest>(`/posts/${id}`, data);
    },

    // DELETE /posts/:id
    deletePost: async (id: string): Promise<void> => {
        return apiClient.delete<void>(`/posts/${id}`);
    },
};
*/

/**
 * PASO 5: Crear hooks de TanStack Query
 * ======================================
 *
 * 5A. Queries (lectura de datos)
 * File: src/features/posts/hooks/use-posts-queries.ts
 */
/*
import { useQuery } from '@tanstack/react-query';
import { postsService } from '../api/posts.service';

// Query keys - Importante para invalidación de cache
export const postsKeys = {
    all: ['posts'] as const,
    lists: () => [...postsKeys.all, 'list'] as const,
    list: (page: number, pageSize: number) =>
        [...postsKeys.lists(), { page, pageSize }] as const,
    details: () => [...postsKeys.all, 'detail'] as const,
    detail: (id: string) => [...postsKeys.details(), id] as const,
};

// Hook para listar posts
export const usePosts = (page: number = 1, pageSize: number = 10) => {
    return useQuery({
        queryKey: postsKeys.list(page, pageSize),
        queryFn: () => postsService.getPosts(page, pageSize),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};

// Hook para obtener un post específico
export const usePost = (id: string) => {
    return useQuery({
        queryKey: postsKeys.detail(id),
        queryFn: () => postsService.getPost(id),
        enabled: !!id, // Solo ejecutar si hay id
        staleTime: 1000 * 60 * 5,
    });
};
*/

/**
 * 5B. Mutations (escritura de datos)
 * File: src/features/posts/hooks/use-posts-mutations.ts
 */
/*
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { postsService } from '../api/posts.service';
import { CreatePostRequest, UpdatePostRequest } from '../types/post.types';
import { postsKeys } from './use-posts-queries';

// Hook para crear un post
export const useCreatePost = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostRequest) => postsService.createPost(data),
        onSuccess: (newPost) => {
            // Invalidar cache de listas
            queryClient.invalidateQueries({ queryKey: postsKeys.lists() });

            // Agregar el nuevo post al cache
            queryClient.setQueryData(postsKeys.detail(newPost.id), newPost);

            toast.success('Post created successfully!');
            router.push(`/posts/${newPost.id}`);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create post');
        },
    });
};

// Hook para actualizar un post
export const useUpdatePost = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePostRequest) => postsService.updatePost(id, data),
        onSuccess: (updatedPost) => {
            // Actualizar cache del post específico
            queryClient.setQueryData(postsKeys.detail(id), updatedPost);

            // Invalidar listas para reflejar cambios
            queryClient.invalidateQueries({ queryKey: postsKeys.lists() });

            toast.success('Post updated successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update post');
        },
    });
};

// Hook para eliminar un post
export const useDeletePost = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => postsService.deletePost(id),
        onSuccess: (_, id) => {
            // Remover del cache
            queryClient.removeQueries({ queryKey: postsKeys.detail(id) });

            // Invalidar listas
            queryClient.invalidateQueries({ queryKey: postsKeys.lists() });

            toast.success('Post deleted successfully!');
            router.push('/posts');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete post');
        },
    });
};
*/

/**
 * PASO 6: Crear componentes
 * ==========================
 *
 * 6A. Lista de posts
 * File: src/features/posts/components/posts-list.tsx
 */
/*
'use client';

import { Button } from '@web/shared/components/ui/button';
import { Card } from '@web/shared/components/ui/card';
import Link from 'next/link';
import { usePosts } from '../hooks/use-posts-queries';

export function PostsList() {
    const { data, isLoading, error } = usePosts();

    if (isLoading) {
        return <div>Loading posts...</div>;
    }

    if (error) {
        return <div>Error loading posts: {error.message}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Posts</h1>
                <Link href="/posts/new">
                    <Button>Create Post</Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {data?.posts.map((post) => (
                    <Card key={post.id} className="p-4">
                        <Link href={`/posts/${post.id}`}>
                            <h2 className="text-xl font-semibold hover:underline">
                                {post.title}
                            </h2>
                        </Link>
                        <p className="text-muted-foreground line-clamp-2">
                            {post.content}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
*/

/**
 * 6B. Formulario de crear/editar post
 * File: src/features/posts/components/post-form.tsx
 */
/*
'use client';

import { Button } from '@web/shared/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@web/shared/components/ui/form';
import { Input } from '@web/shared/components/ui/input';
import { Textarea } from '@web/shared/components/ui/textarea';
import { useFormWithSchema } from '@web/shared/hooks';
import { useCreatePost, useUpdatePost } from '../hooks/use-posts-mutations';
import { createPostSchema } from '../schemas/post.schemas';
import { Post } from '../types/post.types';

interface PostFormProps {
    post?: Post;
}

export function PostForm({ post }: PostFormProps) {
    const form = useFormWithSchema({
        schema: createPostSchema,
        defaultValues: {
            title: post?.title ?? '',
            content: post?.content ?? '',
        },
    });

    const createMutation = useCreatePost();
    const updateMutation = useUpdatePost(post?.id ?? '');

    const mutation = post ? updateMutation : createMutation;

    const onSubmit = form.handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter post title"
                                    {...field}
                                    disabled={mutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter post content"
                                    rows={10}
                                    {...field}
                                    disabled={mutation.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending
                        ? 'Saving...'
                        : post
                          ? 'Update Post'
                          : 'Create Post'}
                </Button>
            </form>
        </Form>
    );
}
*/

/**
 * 6C. Detalle de post
 * File: src/features/posts/components/post-detail.tsx
 */
/*
'use client';

import { Button } from '@web/shared/components/ui/button';
import { Card } from '@web/shared/components/ui/card';
import { formatDate } from '@web/shared/utils';
import Link from 'next/link';
import { useDeletePost } from '../hooks/use-posts-mutations';
import { usePost } from '../hooks/use-posts-queries';

interface PostDetailProps {
    id: string;
}

export function PostDetail({ id }: PostDetailProps) {
    const { data: post, isLoading, error } = usePost(id);
    const deleteMutation = useDeletePost();

    if (isLoading) {
        return <div>Loading post...</div>;
    }

    if (error || !post) {
        return <div>Error loading post</div>;
    }

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">{post.title}</h1>
                    <div className="flex gap-2">
                        <Link href={`/posts/${id}/edit`}>
                            <Button variant="outline">Edit</Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    Created: {formatDate(post.createdAt)}
                </p>

                <div className="prose max-w-none">
                    {post.content}
                </div>
            </Card>
        </div>
    );
}
*/

/**
 * PASO 7: Exportar públicamente
 * ==============================
 * File: src/features/posts/index.ts
 */
/*
export * from './api/posts.service';
export * from './components/posts-list';
export * from './components/post-form';
export * from './components/post-detail';
export * from './hooks/use-posts-queries';
export * from './hooks/use-posts-mutations';
export * from './schemas/post.schemas';
export * from './types/post.types';
*/

/**
 * PASO 8: Crear páginas en App Router
 * ====================================
 *
 * 8A. Lista de posts
 * File: src/app/[locale]/(protected)/posts/page.tsx
 */
/*
import { PostsList } from '@web/features/posts';

export default function PostsPage() {
    return <PostsList />;
}
*/

/**
 * 8B. Crear post
 * File: src/app/[locale]/(protected)/posts/new/page.tsx
 */
/*
import { PostForm } from '@web/features/posts';

export default function NewPostPage() {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            <PostForm />
        </div>
    );
}
*/

/**
 * 8C. Ver post
 * File: src/app/[locale]/(protected)/posts/[id]/page.tsx
 */
/*
import { PostDetail } from '@web/features/posts';

interface PostPageProps {
    params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
    const { id } = await params;
    return <PostDetail id={id} />;
}
*/

/**
 * 8D. Editar post
 * File: src/app/[locale]/(protected)/posts/[id]/edit/page.tsx
 */
/*
'use client';

import { PostForm } from '@web/features/posts';
import { usePost } from '@web/features/posts';

interface EditPostPageProps {
    params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
    const { data: post, isLoading } = usePost(params.id);

    if (isLoading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
            <PostForm post={post} />
        </div>
    );
}
*/

/**
 * ✅ ¡Listo! Feature completo implementado
 *
 * Ahora tienes:
 * - ✅ CRUD completo de posts
 * - ✅ Validación con Zod
 * - ✅ Type-safe en todo el flujo
 * - ✅ Cache management automático con React Query
 * - ✅ Loading y error states manejados
 * - ✅ Optimistic updates (opcional)
 * - ✅ Toasts de feedback
 *
 * ## Mejoras Opcionales
 *
 * 1. **Optimistic Updates**: Actualizar UI antes de la respuesta del servidor
 * 2. **Infinite Scroll**: Para listas largas de posts
 * 3. **Prefetching**: Cargar posts antes de navegar
 * 4. **Search**: Agregar búsqueda con debounce
 * 5. **Filters**: Filtrar posts por fecha, autor, etc.
 * 6. **Tests**: Agregar tests unitarios y de integración
 */

export {};
