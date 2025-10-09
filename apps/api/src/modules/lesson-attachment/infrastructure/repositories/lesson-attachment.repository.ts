import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { LessonAttachment } from '../../domain/entities/lesson-attachment.entity';
import { ILessonAttachmentRepository } from '../../domain/repositories/i-lesson-attachment.repository';
import { lessonAttachments } from '../schemas/lesson-attachment.schema';

@Injectable()
export class LessonAttachmentRepositoryImpl
    extends BaseRepository<LessonAttachment, typeof lessonAttachments>
    implements ILessonAttachmentRepository
{
    protected readonly table = lessonAttachments;
    protected readonly entityName = 'LessonAttachment';

    protected toDomain(schema: typeof lessonAttachments.$inferSelect): LessonAttachment {
        return LessonAttachment.fromPersistence({
            id: schema.id,
            fileName: schema.fileName,
            fileUrl: schema.fileUrl,
            fileType: schema.fileType,
            fileSize: schema.fileSize,
            lessonId: schema.lessonId,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
        });
    }

    protected toSchema(entity: LessonAttachment): any {
        return {
            fileName: entity.fileName,
            fileUrl: entity.fileUrl,
            fileType: entity.fileType,
            ...(entity.fileSize !== undefined && { fileSize: entity.fileSize }),
            lessonId: entity.lessonId,
        };
    }
}
