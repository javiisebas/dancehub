export const TIME = {
    SECOND: 1,
    MINUTE: 60,
    HOUR: 60 * 60,
    DAY: 24 * 60 * 60,
    WEEK: 7 * 24 * 60 * 60,
    MONTH: 30 * 24 * 60 * 60,
} as const;

export const TIME_MS = {
    SECOND: 1000,
    MINUTE: 1000 * TIME.MINUTE,
    HOUR: 1000 * TIME.HOUR,
    DAY: 1000 * TIME.DAY,
    WEEK: 1000 * TIME.WEEK,
    MONTH: 1000 * TIME.MONTH,
} as const;
