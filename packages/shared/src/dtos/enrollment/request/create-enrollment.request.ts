import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EnrollmentStatusEnum, PaymentTypeEnum } from '../../../enums';

export class CreateEnrollmentRequest {
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    enrolledAt?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    expiresAt?: Date;

    @IsString()
    @IsOptional()
    paymentId?: string;

    @IsBoolean()
    @IsOptional()
    addedByArtist?: boolean;

    @IsEnum(EnrollmentStatusEnum)
    @IsOptional()
    status?: EnrollmentStatusEnum;

    @IsEnum(PaymentTypeEnum)
    @IsOptional()
    paymentType?: PaymentTypeEnum;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    courseId: string;
}
