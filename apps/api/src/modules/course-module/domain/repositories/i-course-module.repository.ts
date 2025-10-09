import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { CourseModule } from '../entities/course-module.entity';
import { courseModules } from '../../infrastructure/schemas/course-module.schema';

export const COURSE_MODULE_REPOSITORY = Symbol('COURSE_MODULE_REPOSITORY');

export type CourseModuleField = InferFields<typeof courseModules>;
export type CourseModuleRelations = {};

export interface ICourseModuleRepository extends IBaseRepository<CourseModule, CourseModuleField, CourseModuleRelations> {}
