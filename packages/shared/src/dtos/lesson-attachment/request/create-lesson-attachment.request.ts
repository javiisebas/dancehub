import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class CreateLessonAttachmentRequest {
            @IsString()
            @IsNotEmpty()
            @MaxLength(255)
        fileName:
        string;

            @IsString()
            @IsNotEmpty()
        fileUrl:
        string;

            @IsString()
            @IsNotEmpty()
        fileType:
        string;

            @IsInt()
            @IsOptional()
            @Min(0)
        fileSize?:
        number;

        @IsString() @IsNotEmpty()
        lessonId: string;

}