import { BusinessException } from '@api/common/exceptions/business.exception';
import { createCanonicalJson } from '@api/common/utils/json-canonical.util';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
    QrCodeOptionsDto,
    QrCodePayloadDto,
    QrErrorCorrectionLevelEnum,
    QrOutputFormatEnum,
    TIME_MS,
} from '@repo/shared';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { TypedConfigService } from '../config/config.service';
import { QrResponseDto } from './qr.response.dto';

/**
 * Service for generating and verifying QR codes
 */
@Injectable()
export class QrService {
    private readonly defaultSecretKey: string | null;

    constructor(private readonly configService: TypedConfigService) {
        this.defaultSecretKey = this.configService.get('auth.qrSecretKey') ?? null;
    }

    /**
     * Generate a QR code with secure payload
     *
     * @param data - Data to encode (minimal non-sensitive information recommended)
     * @param options - QR code generation options
     * @param securityOptions - Security options for QR code generation
     * @returns Promise with the generated QR code result
     * @throws BusinessException if generation fails
     */
    async generateQrCode(
        data: Record<string, any>,
        options: QrCodeOptionsDto = {},
    ): Promise<QrResponseDto> {
        try {
            this.validateQrData(data);

            const { outputFormat = QrOutputFormatEnum.PNG_DATA_URL } = options;

            const token = this.getToken();
            const expiresAt = this.getExpiration(options);

            const qrData = this.getQrData(data, token, expiresAt);
            const qrOptions = this.getQrCodeOptions(options);
            const qrCode = await this.getQrCode(outputFormat, qrData, qrOptions);

            return {
                qrCode,
                token,
                expiresAt,
            };
        } catch (error) {
            if (error instanceof BusinessException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new BusinessException({
                code: 'qr.generationFailed',
                args: { reason: errorMessage },
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }

    /**
     * Verify a QR code token and payload
     *
     * @param payload - The QR code payload to verify
     * @param securityOptions - Security options for verification
     * @returns The verified data or null if invalid
     * @throws BusinessException if verification fails with critical error
     */
    verifyQrCode<T extends Record<string, any>>(payload: QrCodePayloadDto<T>): T | null {
        try {
            if (!payload || typeof payload !== 'object') {
                throw new BusinessException({
                    code: 'qr.invalidPayload',
                });
            }

            if (!payload.token) {
                throw new BusinessException({
                    code: 'qr.missingToken',
                });
            }

            if (payload.exp && Date.now() > payload.exp * TIME_MS.SECOND) {
                throw new BusinessException({
                    code: 'qr.expired',
                });
            }

            if (payload.sig) {
                const { sig, ...dataToVerify } = payload;
                const calculatedSignature = this.getSignature(dataToVerify);

                if (calculatedSignature !== sig) {
                    throw new BusinessException({
                        code: 'qr.invalidSignature',
                    });
                }
            }

            if (!payload.data) {
                throw new BusinessException({
                    code: 'qr.missingData',
                });
            }

            return payload.data;
        } catch (error) {
            if (error instanceof BusinessException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new BusinessException({
                code: 'qr.verificationFailed',
                args: { reason: errorMessage },
            });
        }
    }

    private validateQrData(data: Record<string, any>): void {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            throw new BusinessException({
                code: 'qr.invalidData',
            });
        }
    }

    private getToken() {
        return crypto.randomUUID();
    }

    private getExpiration(options: QrCodeOptionsDto) {
        const { expiresIn } = options;
        const expiresAt = expiresIn ? Date.now() + expiresIn * TIME_MS.SECOND : undefined;
        return expiresAt;
    }

    private getSecretKey(): string {
        if (!this.defaultSecretKey) {
            throw new BusinessException({
                code: 'qr.secretKeyNotConfigured',
            });
        }

        return this.defaultSecretKey;
    }

    private getQrData<T extends Record<string, any>>(
        data: T,
        token: string,
        expiresAt: number | undefined,
    ): string {
        const payload: QrCodePayloadDto<T> = {
            token,
            data,
            sig: '',
        };

        if (expiresAt) {
            payload.exp = Math.floor(expiresAt / TIME_MS.SECOND);
        }

        payload.sig = this.getSignature(payload);

        return JSON.stringify(payload);
    }

    private getQrCodeOptions(
        options: QrCodeOptionsDto,
    ): QRCode.QRCodeToDataURLOptions | QRCode.QRCodeToBufferOptions {
        const {
            size = 200,
            errorCorrectionLevel = QrErrorCorrectionLevelEnum.M,
            margin = 4,
            color = '#000000',
            backgroundColor = '#FFFFFF',
        } = options;

        const qrOptions: QRCode.QRCodeToBufferOptions | QRCode.QRCodeToDataURLOptions = {
            errorCorrectionLevel,
            width: size,
            margin,
            color: {
                dark: color,
                light: backgroundColor,
            },
        };

        return qrOptions;
    }

    private async getQrCode(
        outputFormat: QrOutputFormatEnum,
        qrData: string,
        qrOptions: QRCode.QRCodeToDataURLOptions | QRCode.QRCodeToBufferOptions,
    ): Promise<string | Buffer> {
        switch (outputFormat) {
            case QrOutputFormatEnum.SVG:
                return await QRCode.toString(qrData, {
                    ...qrOptions,
                    type: 'svg',
                });
            case QrOutputFormatEnum.PNG_BUFFER:
                return await QRCode.toBuffer(qrData, qrOptions as QRCode.QRCodeToBufferOptions);
            case QrOutputFormatEnum.PNG_DATA_URL:
            default:
                return await QRCode.toDataURL(qrData, qrOptions as QRCode.QRCodeToDataURLOptions);
        }
    }

    private getSignature(payload: Record<string, any>): string {
        const canonicalData = createCanonicalJson(payload);
        const hmac = crypto.createHmac('sha256', this.getSecretKey());
        return hmac.update(canonicalData).digest('hex');
    }
}
