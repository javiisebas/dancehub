export interface GenericGenerateTokenDto {
    id: string;
    email: string;
    secret: string;
    expiresIn: string;
    jti?: string;
}
