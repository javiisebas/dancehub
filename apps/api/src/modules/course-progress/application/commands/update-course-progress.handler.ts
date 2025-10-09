import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateCourseProgressRequest } from '@repo/shared';
import { CourseProgress } from '../../domain/entities/course-progress.entity';
import {
    ICourseProgressRepository,
    COURSE_PROGRESS_REPOSITORY,
} from '../../domain/repositories/i-course-progress.repository';

export class UpdateCourseProgressCommand extends UpdateCommand<UpdateCourseProgressRequest> {}

@CommandHandler(UpdateCourseProgressCommand)
export class UpdateCourseProgressHandler implements ICommandHandler<UpdateCourseProgressCommand> {
    constructor(
        @Inject(COURSE_PROGRESS_REPOSITORY) private readonly repository: ICourseProgressRepository,
    ) {}

    async execute(command: UpdateCourseProgressCommand): Promise<CourseProgress> {
        const { id, data } = command;

        const courseProgress = await this.repository.findById(id);
        if (!courseProgress) {
            throw new NotFoundException('CourseProgress');
        }

        if (data.completed !== undefined) {
            courseProgress.completed = data.completed;
        }
        if (data.progressPercentage !== undefined) {
            courseProgress.progressPercentage = data.progressPercentage;
        }
        if (data.lastWatchedAt !== undefined) {
            courseProgress.lastWatchedAt = data.lastWatchedAt;
        }
        if (data.watchTimeSeconds !== undefined) {
            courseProgress.watchTimeSeconds = data.watchTimeSeconds;
        }
        if (data.userId !== undefined) {
            courseProgress.userId = data.userId;
        }
        if (data.lessonId !== undefined) {
            courseProgress.lessonId = data.lessonId;
        }

        return await this.repository.update(id, courseProgress);
    }
}