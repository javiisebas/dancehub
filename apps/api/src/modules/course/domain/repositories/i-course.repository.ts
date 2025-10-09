import { InferFields } from '@api/modules/core/database/base';
import { IBaseTranslatableRepository } from '@api/modules/core/database/interfaces/i-base-translatable.repository';
import { courses } from '../../infrastructure/schemas/course.schema';
import { CourseTranslation } from '../entities/course-translation.entity';
import { Course } from '../entities/course.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { DanceStyle } from '../../../dance-style/domain/entities/dance-style.entity';

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export type CourseField = InferFields<typeof courses>;
export type CourseRelations = {
    instructor?: User | User[];
    danceStyle?: DanceStyle | DanceStyle[];
};

export interface ICourseRepository
    extends IBaseTranslatableRepository<Course, CourseTranslation, CourseField, CourseRelations> {
    findBySlug(slug: string): Promise<Course | null>;
    slugExists(slug: string): Promise<boolean>;
}
