import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class CreateCourseModuleRequest {
            @IsString()
            @IsNotEmpty()
            @MaxLength(255)
        name:
        string;

            @IsString()
            @IsOptional()
        description?:
        string;

            @IsInt()
            @IsNotEmpty()
            @Min(0)
        order:
        number;

        @IsString() @IsNotEmpty()
        courseId: string;

}