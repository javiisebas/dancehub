import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class CreateCourseProgressRequest {
            @IsBoolean()
            @IsOptional()
        completed:
        boolean;

            @IsInt()
            @IsOptional()
            @Min(0)
            @Max(100)
        progressPercentage:
        number;

            @IsDate()
            @IsOptional()
            @Type(() => Date)
        lastWatchedAt?:
        Date;

            @IsInt()
            @IsOptional()
            @Min(0)
        watchTimeSeconds:
        number;

        @IsString() @IsNotEmpty()
        userId: string;

        @IsString() @IsNotEmpty()
        lessonId: string;

}