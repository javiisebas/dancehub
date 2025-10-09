import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { LessonAttachment } from '../entities/lesson-attachment.entity';
import { lessonAttachments } from '../../infrastructure/schemas/lesson-attachment.schema';

export const LESSON_ATTACHMENT_REPOSITORY = Symbol('LESSON_ATTACHMENT_REPOSITORY');

export type LessonAttachmentField = InferFields<typeof lessonAttachments>;
export type LessonAttachmentRelations = {};

export interface ILessonAttachmentRepository extends IBaseRepository<LessonAttachment, LessonAttachmentField, LessonAttachmentRelations> {}
