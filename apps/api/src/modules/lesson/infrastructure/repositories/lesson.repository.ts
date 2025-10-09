import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { Lesson } from '../../domain/entities/lesson.entity';
import { ILessonRepository } from '../../domain/repositories/i-lesson.repository';
import { lessons } from '../schemas/lesson.schema';

@Injectable()
export class LessonRepositoryImpl
    extends BaseRepository<Lesson, typeof lessons>
    implements ILessonRepository
{
    protected readonly table = lessons;
    protected readonly entityName = 'Lesson';

    protected toDomain(schema: typeof lessons.$inferSelect): Lesson {
        return Lesson.fromPersistence({
            id: schema.id,
            name: schema.name,
            description: schema.description,
            content: schema.content,
            videoUrl: schema.videoUrl,
            duration: schema.duration,
            order: schema.order,
            moduleId: schema.moduleId,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
        });
    }

    protected toSchema(entity: Lesson): any {
        return {
            name: entity.name,
            ...(entity.description !== undefined && { description: entity.description }),
            ...(entity.content !== undefined && { content: entity.content }),
            ...(entity.videoUrl !== undefined && { videoUrl: entity.videoUrl }),
            ...(entity.duration !== undefined && { duration: entity.duration }),
            order: entity.order,
            moduleId: entity.moduleId,
        };
    }
}
