import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { CourseProgress } from '../../domain/entities/course-progress.entity';
import { ICourseProgressRepository } from '../../domain/repositories/i-course-progress.repository';
import { courseProgresses } from '../schemas/course-progress.schema';

@Injectable()
export class CourseProgressRepositoryImpl
    extends BaseRepository<CourseProgress, typeof courseProgresses>
    implements ICourseProgressRepository
{
    protected readonly table = courseProgresses;
    protected readonly entityName = 'CourseProgress';

    protected toDomain(schema: typeof courseProgresses.$inferSelect): CourseProgress {
        return CourseProgress.fromPersistence({
            id: schema.id,
            completed: schema.completed,
            progressPercentage: schema.progressPercentage,
            lastWatchedAt: schema.lastWatchedAt,
            watchTimeSeconds: schema.watchTimeSeconds,
            userId: schema.userId,
            lessonId: schema.lessonId,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
        });
    }

    protected toSchema(entity: CourseProgress): any {
        return {
            completed: entity.completed,
            progressPercentage: entity.progressPercentage,
            ...(entity.lastWatchedAt !== undefined && { lastWatchedAt: entity.lastWatchedAt }),
            watchTimeSeconds: entity.watchTimeSeconds,
            userId: entity.userId,
            lessonId: entity.lessonId,
        };
    }
}
