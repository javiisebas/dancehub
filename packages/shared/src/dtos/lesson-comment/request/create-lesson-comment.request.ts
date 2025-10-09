import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateLessonCommentRequest {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    @IsOptional()
    @Min(0)
    timestamp?: number;

    @IsUUID()
    @IsOptional()
    parentId?: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    lessonId: string;
}
