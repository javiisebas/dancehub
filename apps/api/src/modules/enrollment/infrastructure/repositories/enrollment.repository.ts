import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import { IEnrollmentRepository } from '../../domain/repositories/i-enrollment.repository';
import { enrollments } from '../schemas/enrollment.schema';

@Injectable()
export class EnrollmentRepositoryImpl
    extends BaseRepository<Enrollment, typeof enrollments>
    implements IEnrollmentRepository
{
    protected readonly table = enrollments;
    protected readonly entityName = 'Enrollment';

    protected toDomain(schema: typeof enrollments.$inferSelect): Enrollment {
        return Enrollment.fromPersistence({
            id: schema.id,
            enrolledAt: schema.enrolledAt,
            expiresAt: schema.expiresAt,
            paymentId: schema.paymentId,
            addedByArtist: schema.addedByArtist,
            status: schema.status as any,
            paymentType: schema.paymentType as any,
            userId: schema.userId,
            courseId: schema.courseId,
            createdAt: schema.createdAt,
            updatedAt: schema.updatedAt,
        });
    }

    protected toSchema(entity: Enrollment): any {
        return {
            enrolledAt: entity.enrolledAt,
            ...(entity.expiresAt !== undefined && { expiresAt: entity.expiresAt }),
            ...(entity.paymentId !== undefined && { paymentId: entity.paymentId }),
            addedByArtist: entity.addedByArtist,
            status: entity.status,
            paymentType: entity.paymentType,
            userId: entity.userId,
            courseId: entity.courseId,
        };
    }
}
