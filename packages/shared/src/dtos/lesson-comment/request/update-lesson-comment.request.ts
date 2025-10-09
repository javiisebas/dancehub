import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateLessonCommentRequest {
    @IsString()
    @IsOptional()
    content?: string;

    @IsInt()
    @IsOptional()
    @Min(0)
    timestamp?: number | null;

    @IsUUID()
    @IsOptional()
    parentId?: string | null;

    @IsString()
    @IsOptional()
    userId?: string;

    @IsString()
    @IsOptional()
    lessonId?: string;
}
