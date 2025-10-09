import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { Enrollment } from '../entities/enrollment.entity';
import { enrollments } from '../../infrastructure/schemas/enrollment.schema';

export const ENROLLMENT_REPOSITORY = Symbol('ENROLLMENT_REPOSITORY');

export type EnrollmentField = InferFields<typeof enrollments>;
export type EnrollmentRelations = {};

export interface IEnrollmentRepository extends IBaseRepository<Enrollment, EnrollmentField, EnrollmentRelations> {}
