export const STORAGE_CACHE_KEYS = {
    byId: (id: string) => `storage:${id}`,
    byUserId: (userId: string) => `storage:user:${userId}`,
    byPath: (path: string) => `storage:path:${path}`,
    pattern: {
        all: 'storage:*',
        byUser: (userId: string) => `storage:user:${userId}*`,
    },
} as const;
