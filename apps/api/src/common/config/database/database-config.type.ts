export type DatabaseConfig = {
    host?: string;
    key?: string;
    logging?: boolean;
    maxConnections?: number;
    name?: string;
    password?: string;
    port?: number;
    ssl?: boolean;
    type?: string;
    url?: string;
    username?: string;
    poolMin?: number;
    poolSize?: number;
    retryAttempts?: number;
    connectionTimeout?: number;
    idleTimeout?: number;
};
