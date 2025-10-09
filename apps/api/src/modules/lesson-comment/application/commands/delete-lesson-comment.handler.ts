import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    ILessonCommentRepository,
    LESSON_COMMENT_REPOSITORY,
} from '../../domain/repositories/i-lesson-comment.repository';

export class DeleteLessonCommentCommand extends DeleteCommand {}

@Injectable()
export class DeleteLessonCommentHandler {
    constructor(
        @Inject(LESSON_COMMENT_REPOSITORY) private readonly repository: ILessonCommentRepository,
    ) {}

    async execute({ id }: DeleteLessonCommentCommand): Promise<void> {
        await this.repository.delete(id);
    }
}