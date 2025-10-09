import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { LessonComment } from '../../domain/entities/lesson-comment.entity';
import { ILessonCommentRepository } from '../../domain/repositories/i-lesson-comment.repository';
import { lessonComments } from '../schemas/lesson-comment.schema';

@Injectable()
export class LessonCommentRepositoryImpl
    extends BaseRepository<LessonComment, typeof lessonComments>
    implements ILessonCommentRepository
{
    protected readonly table = lessonComments;
    protected readonly entityName = 'LessonComment';

    protected toDomain(schema: typeof lessonComments.$inferSelect): LessonComment {
        return LessonComment.fromPersistence({
            id: schema.id,
            content: schema.content,
            timestamp: schema.timestamp,
            parentId: schema.parentId,
            userId: schema.userId,
            lessonId: schema.lessonId,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
        });
    }

    protected toSchema(entity: LessonComment): any {
        return {
            content: entity.content,
            ...(entity.timestamp !== undefined && { timestamp: entity.timestamp }),
            ...(entity.parentId !== undefined && { parentId: entity.parentId }),
            userId: entity.userId,
            lessonId: entity.lessonId,
        };
    }
}
