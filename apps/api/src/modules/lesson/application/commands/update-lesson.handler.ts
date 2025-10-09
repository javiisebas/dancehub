import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateLessonRequest } from '@repo/shared';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
    ILessonRepository,
    LESSON_REPOSITORY,
} from '../../domain/repositories/i-lesson.repository';

export class UpdateLessonCommand extends UpdateCommand<UpdateLessonRequest> {}

@CommandHandler(UpdateLessonCommand)
export class UpdateLessonHandler implements ICommandHandler<UpdateLessonCommand> {
    constructor(
        @Inject(LESSON_REPOSITORY) private readonly repository: ILessonRepository,
    ) {}

    async execute(command: UpdateLessonCommand): Promise<Lesson> {
        const { id, data } = command;

        const lesson = await this.repository.findById(id);
        if (!lesson) {
            throw new NotFoundException('Lesson');
        }

        if (data.name !== undefined) {
            lesson.name = data.name;
        }
        if (data.description !== undefined) {
            lesson.description = data.description;
        }
        if (data.content !== undefined) {
            lesson.content = data.content;
        }
        if (data.videoUrl !== undefined) {
            lesson.videoUrl = data.videoUrl;
        }
        if (data.duration !== undefined) {
            lesson.duration = data.duration;
        }
        if (data.order !== undefined) {
            lesson.order = data.order;
        }
        if (data.moduleId !== undefined) {
            lesson.moduleId = data.moduleId;
        }

        return await this.repository.update(id, lesson);
    }
}