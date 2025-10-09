import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilterOperator, LogicalOperator } from '@repo/shared';
import { CourseProgress } from '../../domain/entities/course-progress.entity';
import {
    COURSE_PROGRESS_REPOSITORY,
    ICourseProgressRepository,
} from '../../domain/repositories/i-course-progress.repository';

export class UpdateLessonProgressCommand {
    constructor(
        public readonly userId: string,
        public readonly lessonId: string,
        public readonly progressPercentage: number,
        public readonly watchTimeSeconds: number,
        public readonly completed: boolean,
    ) {}
}

@CommandHandler(UpdateLessonProgressCommand)
export class UpdateLessonProgressHandler implements ICommandHandler<UpdateLessonProgressCommand> {
    constructor(
        @Inject(COURSE_PROGRESS_REPOSITORY)
        private readonly progressRepository: ICourseProgressRepository,
    ) {}

    async execute(command: UpdateLessonProgressCommand): Promise<{ progressId: string }> {
        const existingProgress = await this.progressRepository.findOne({
            filter: {
                operator: LogicalOperator.AND,
                conditions: [
                    { field: 'userId', operator: FilterOperator.EQ, value: command.userId },
                    { field: 'lessonId', operator: FilterOperator.EQ, value: command.lessonId },
                ],
            },
        });

        if (existingProgress) {
            existingProgress.progressPercentage = command.progressPercentage;
            existingProgress.watchTimeSeconds = command.watchTimeSeconds;
            existingProgress.completed = command.completed;
            existingProgress.lastWatchedAt = new Date();

            await this.progressRepository.update(existingProgress.id, existingProgress);
            return { progressId: existingProgress.id };
        }

        const progress = CourseProgress.create({
            id: crypto.randomUUID(),
            userId: command.userId,
            lessonId: command.lessonId,
            completed: command.completed,
            progressPercentage: command.progressPercentage,
            lastWatchedAt: new Date(),
            watchTimeSeconds: command.watchTimeSeconds,
        });

        await this.progressRepository.create(progress);
        return { progressId: progress.id };
    }
}
