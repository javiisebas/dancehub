import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { LessonComment } from '../entities/lesson-comment.entity';
import { lessonComments } from '../../infrastructure/schemas/lesson-comment.schema';

export const LESSON_COMMENT_REPOSITORY = Symbol('LESSON_COMMENT_REPOSITORY');

export type LessonCommentField = InferFields<typeof lessonComments>;
export type LessonCommentRelations = {};

export interface ILessonCommentRepository extends IBaseRepository<LessonComment, LessonCommentField, LessonCommentRelations> {}
