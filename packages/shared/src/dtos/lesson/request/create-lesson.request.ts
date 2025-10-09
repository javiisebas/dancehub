import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class CreateLessonRequest {
            @IsString()
            @IsNotEmpty()
            @MaxLength(255)
        name:
        string;

            @IsString()
            @IsOptional()
        description?:
        string;

            @IsString()
            @IsOptional()
        content?:
        string;

            @IsString()
            @IsOptional()
        videoUrl?:
        string;

            @IsInt()
            @IsOptional()
            @Min(0)
        duration?:
        number;

            @IsInt()
            @IsNotEmpty()
            @Min(0)
        order:
        number;

        @IsString() @IsNotEmpty()
        moduleId: string;

}