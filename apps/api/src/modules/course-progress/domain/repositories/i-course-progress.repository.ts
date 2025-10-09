import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { courseProgresses } from '../../infrastructure/schemas/course-progress.schema';
import { CourseProgress } from '../entities/course-progress.entity';

export const COURSE_PROGRESS_REPOSITORY = Symbol('COURSE_PROGRESS_REPOSITORY');

export type CourseProgressField = InferFields<typeof courseProgresses>;
export type CourseProgressRelations = {};

export interface ICourseProgressRepository
    extends IBaseRepository<CourseProgress, CourseProgressField, CourseProgressRelations> {}
