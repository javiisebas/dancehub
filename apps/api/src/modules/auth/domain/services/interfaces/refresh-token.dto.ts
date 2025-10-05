export interface RefreshTokenDto {
    id: string;
    email: string;
    jti?: string;
    iat: number;
    exp: number;
}
