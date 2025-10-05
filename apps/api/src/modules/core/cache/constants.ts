export const CacheTTL = {
    VERY_SHORT: 60,
    SHORT: 300,
    MEDIUM: 900,
    LONG: 3600,
    VERY_LONG: 86400,
} as const;

export type CacheTTLValue = (typeof CacheTTL)[keyof typeof CacheTTL];

export enum CacheDomain {
    AUTH = 'auth',
    USER = 'user',
    DANCE_STYLE = 'dance-style',
}
