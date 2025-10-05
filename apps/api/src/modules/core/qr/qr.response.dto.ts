export interface QrResponseDto {
    qrCode: string | Buffer;
    token: string;
    expiresAt?: number;
}
