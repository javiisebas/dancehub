import { Type } from 'class-transformer'; import { IsNotEmpty, IsString, IsOptional, IsNumber,
IsBoolean, IsDate, IsEnum, IsInt, MinLength, MaxLength, Min, Max, } from 'class-validator';

export class UpdateLessonAttachmentRequest {
            @IsString()
            @IsOptional()
            @MaxLength(255)
        fileName?:
        string;

            @IsString()
            @IsOptional()
        fileUrl?:
        string;

            @IsString()
            @IsOptional()
        fileType?:
        string;

            @IsInt()
            @IsOptional()
            @Min(0)
        fileSize?:
        number | null;

        @IsString() @IsOptional()
        lessonId?: string;

}