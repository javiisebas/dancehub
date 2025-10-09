import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class UpdateEnrollmentRequest {
            @IsDate()
            @IsOptional()
            @Type(() => Date)
        enrolledAt?:
        Date;

            @IsDate()
            @IsOptional()
            @Type(() => Date)
        expiresAt?:
        Date | null;

            @IsString()
            @IsOptional()
        paymentId?:
        string | null;

            @IsBoolean()
            @IsOptional()
        addedByArtist?:
        boolean;

        @IsString() @IsOptional()
        userId?: string;

        @IsString() @IsOptional()
        courseId?: string;

}