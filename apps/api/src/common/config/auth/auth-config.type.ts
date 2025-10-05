export type AuthConfig = {
    jwtSecret: string;
    jwtExpirationTime: string;
    jwtRefreshSecret: string;
    jwtRefreshExpirationTime: string;
    qrSecretKey: string | null;
};
