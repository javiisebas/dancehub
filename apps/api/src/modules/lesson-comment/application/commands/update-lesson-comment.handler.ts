import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateLessonCommentRequest } from '@repo/shared';
import { LessonComment } from '../../domain/entities/lesson-comment.entity';
import {
    ILessonCommentRepository,
    LESSON_COMMENT_REPOSITORY,
} from '../../domain/repositories/i-lesson-comment.repository';

export class UpdateLessonCommentCommand extends UpdateCommand<UpdateLessonCommentRequest> {}

@CommandHandler(UpdateLessonCommentCommand)
export class UpdateLessonCommentHandler implements ICommandHandler<UpdateLessonCommentCommand> {
    constructor(
        @Inject(LESSON_COMMENT_REPOSITORY) private readonly repository: ILessonCommentRepository,
    ) {}

    async execute(command: UpdateLessonCommentCommand): Promise<LessonComment> {
        const { id, data } = command;

        const lessonComment = await this.repository.findById(id);
        if (!lessonComment) {
            throw new NotFoundException('LessonComment');
        }

        if (data.content !== undefined) {
            lessonComment.content = data.content;
        }
        if (data.timestamp !== undefined) {
            lessonComment.timestamp = data.timestamp;
        }
        if (data.parentId !== undefined) {
            lessonComment.parentId = data.parentId;
        }
        if (data.userId !== undefined) {
            lessonComment.userId = data.userId;
        }
        if (data.lessonId !== undefined) {
            lessonComment.lessonId = data.lessonId;
        }

        return await this.repository.update(id, lessonComment);
    }
}