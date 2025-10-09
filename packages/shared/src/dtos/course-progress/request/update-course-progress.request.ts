import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class UpdateCourseProgressRequest {
            @IsBoolean()
            @IsOptional()
        completed?:
        boolean;

            @IsInt()
            @IsOptional()
            @Min(0)
            @Max(100)
        progressPercentage?:
        number;

            @IsDate()
            @IsOptional()
            @Type(() => Date)
        lastWatchedAt?:
        Date | null;

            @IsInt()
            @IsOptional()
            @Min(0)
        watchTimeSeconds?:
        number;

        @IsString() @IsOptional()
        userId?: string;

        @IsString() @IsOptional()
        lessonId?: string;

}