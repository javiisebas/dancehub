export type CacheConfig = {
    host: string;
    port: number;
    ttl: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
};
