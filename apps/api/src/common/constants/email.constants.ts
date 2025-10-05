export const EMAIL_QUEUE = {
    name: 'email-queue',
    jobs: {
        SEND_EMAIL: 'send-email',
    },
    attempts: 5,
} as const;
