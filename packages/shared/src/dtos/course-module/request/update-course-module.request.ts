import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class UpdateCourseModuleRequest {
            @IsString()
            @IsOptional()
            @MaxLength(255)
        name?:
        string;

            @IsString()
            @IsOptional()
        description?:
        string | null;

            @IsInt()
            @IsOptional()
            @Min(0)
        order?:
        number;

        @IsString() @IsOptional()
        courseId?: string;

}