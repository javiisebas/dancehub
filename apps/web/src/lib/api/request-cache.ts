interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

export class RequestCache {
    private cache: Map<string, CacheEntry<unknown>>;
    private defaultTTL: number;

    constructor(defaultTTL: number = 5 * 60 * 1000) {
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }

    set<T>(key: string, data: T, ttl?: number): void {
        const timestamp = Date.now();
        const expiresAt = timestamp + (ttl || this.defaultTTL);

        this.cache.set(key, {
            data,
            timestamp,
            expiresAt,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    invalidate(key: string): void {
        this.cache.delete(key);
    }

    invalidatePattern(pattern: RegExp): void {
        Array.from(this.cache.keys()).forEach((key) => {
            if (pattern.test(key)) {
                this.cache.delete(key);
            }
        });
    }

    clear(): void {
        this.cache.clear();
    }

    getCacheKey(...parts: (string | number | undefined | null)[]): string {
        return parts.filter((part) => part !== undefined && part !== null).join(':');
    }

    cleanup(): void {
        const now = Date.now();
        Array.from(this.cache.entries()).forEach(([key, entry]) => {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        });
    }

    get size(): number {
        return this.cache.size;
    }

    setDefaultTTL(ttl: number): void {
        this.defaultTTL = ttl;
    }
}

export const globalCache = new RequestCache();

if (typeof window !== 'undefined') {
    setInterval(() => {
        globalCache.cleanup();
    }, 60000);
}

export function cached<T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    options: {
        ttl?: number;
        keyGenerator?: (...args: Parameters<T>) => string;
        cache?: RequestCache;
    } = {},
): T {
    const cache = options.cache || globalCache;
    const keyGenerator = options.keyGenerator || ((...args) => JSON.stringify(args));

    return (async (...args: Parameters<T>) => {
        const key = keyGenerator(...args);
        const cached = cache.get(key);

        if (cached !== null) {
            return cached;
        }

        const result = await fn(...args);
        cache.set(key, result, options.ttl);

        return result;
    }) as T;
}
