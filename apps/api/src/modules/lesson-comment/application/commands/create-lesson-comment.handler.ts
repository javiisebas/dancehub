import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateLessonCommentRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { LessonComment } from '../../domain/entities/lesson-comment.entity';
import {
    ILessonCommentRepository,
    LESSON_COMMENT_REPOSITORY,
} from '../../domain/repositories/i-lesson-comment.repository';

export class CreateLessonCommentCommand extends CreateCommand<CreateLessonCommentRequest> {}

@Injectable()
export class CreateLessonCommentHandler {
    constructor(
        @Inject(LESSON_COMMENT_REPOSITORY) private readonly repository: ILessonCommentRepository,
    ) {}

    async execute({ data }: CreateLessonCommentCommand) {
        const lessonComment = LessonComment.create({
            id: randomUUID(),
            content: data.content,
            timestamp: data.timestamp,
            parentId: data.parentId,
            userId: data.userId,
            lessonId: data.lessonId,
        });

        return this.repository.save(lessonComment);
    }
}