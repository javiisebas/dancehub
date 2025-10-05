import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { QrErrorCorrectionLevelEnum, QrOutputFormatEnum } from '../enums';

export class QrCodeOptionsDto {
    /**
     * Size of the QR code in pixels (default: 200)
     */
    @IsOptional()
    @IsNumber()
    size?: number;

    /**
     * Error correction level (default: 'M')
     * L - Low (7% of data can be restored)
     * M - Medium (15% of data can be restored)
     * Q - Quartile (25% of data can be restored)
     * H - High (30% of data can be restored)
     */
    @IsOptional()
    @IsEnum(QrErrorCorrectionLevelEnum)
    errorCorrectionLevel?: QrErrorCorrectionLevelEnum;

    /**
     * QR code margin (default: 4)
     */
    @IsOptional()
    @IsNumber()
    margin?: number;

    /**
     * Color of the QR code (default: #000000)
     */
    @IsOptional()
    @IsString()
    color?: string;

    /**
     * Background color (default: #FFFFFF)
     */
    @IsOptional()
    @IsString()
    backgroundColor?: string;

    /**
     * Output format (default: QrOutputFormatEnum.PNG_DATA_URL)
     */
    @IsOptional()
    @IsEnum(QrOutputFormatEnum)
    outputFormat?: QrOutputFormatEnum;

    /**
     * Expiration time in seconds (default: 86400 - 24 hours)
     */
    @IsOptional()
    @IsNumber()
    expiresIn?: number;
}

export class QrCodePayloadDto<T extends Record<string, any>> {
    @IsString()
    @Expose()
    token: string;

    @IsObject()
    @Expose()
    data: T;

    @IsOptional()
    @IsNumber()
    @Expose()
    exp?: number;

    @IsString()
    @Expose()
    sig: string;
}
