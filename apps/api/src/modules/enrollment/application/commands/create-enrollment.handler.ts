import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateEnrollmentRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
    ENROLLMENT_REPOSITORY,
    IEnrollmentRepository,
} from '../../domain/repositories/i-enrollment.repository';

export class CreateEnrollmentCommand extends CreateCommand<CreateEnrollmentRequest> {}

@Injectable()
export class CreateEnrollmentHandler {
    constructor(
        @Inject(ENROLLMENT_REPOSITORY) private readonly repository: IEnrollmentRepository,
    ) {}

    async execute({ data }: CreateEnrollmentCommand) {
        const enrollment = Enrollment.create({
            id: randomUUID(),
            enrolledAt: data.enrolledAt,
            expiresAt: data.expiresAt,
            paymentId: data.paymentId,
            addedByArtist: data.addedByArtist,
            status: data.status,
            paymentType: data.paymentType,
            userId: data.userId,
            courseId: data.courseId,
        });

        return this.repository.save(enrollment);
    }
}
