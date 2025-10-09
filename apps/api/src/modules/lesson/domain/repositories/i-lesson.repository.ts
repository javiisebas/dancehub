import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { Lesson } from '../entities/lesson.entity';
import { lessons } from '../../infrastructure/schemas/lesson.schema';

export const LESSON_REPOSITORY = Symbol('LESSON_REPOSITORY');

export type LessonField = InferFields<typeof lessons>;
export type LessonRelations = {};

export interface ILessonRepository extends IBaseRepository<Lesson, LessonField, LessonRelations> {}
