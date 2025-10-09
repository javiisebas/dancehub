import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCourseProgressRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { CourseProgress } from '../../domain/entities/course-progress.entity';
import {
    ICourseProgressRepository,
    COURSE_PROGRESS_REPOSITORY,
} from '../../domain/repositories/i-course-progress.repository';

export class CreateCourseProgressCommand extends CreateCommand<CreateCourseProgressRequest> {}

@Injectable()
export class CreateCourseProgressHandler {
    constructor(
        @Inject(COURSE_PROGRESS_REPOSITORY) private readonly repository: ICourseProgressRepository,
    ) {}

    async execute({ data }: CreateCourseProgressCommand) {
        const courseProgress = CourseProgress.create({
            id: randomUUID(),
            completed: data.completed,
            progressPercentage: data.progressPercentage,
            lastWatchedAt: data.lastWatchedAt,
            watchTimeSeconds: data.watchTimeSeconds,
            userId: data.userId,
            lessonId: data.lessonId,
        });

        return this.repository.save(courseProgress);
    }
}