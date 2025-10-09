import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FilterOperator, LogicalOperator } from '@repo/shared';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
    ENROLLMENT_REPOSITORY,
    IEnrollmentRepository,
} from '../../domain/repositories/i-enrollment.repository';

export class EnrollUserCommand {
    constructor(
        public readonly userId: string,
        public readonly courseId: string,
        public readonly paymentId: string | null,
        public readonly addedByArtist: boolean,
        public readonly expiresAt?: Date,
    ) {}
}

@CommandHandler(EnrollUserCommand)
export class EnrollUserHandler implements ICommandHandler<EnrollUserCommand> {
    constructor(
        @Inject(ENROLLMENT_REPOSITORY)
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) {}

    async execute(command: EnrollUserCommand): Promise<{ enrollmentId: string }> {
        const existingEnrollment = await this.enrollmentRepository.findOne({
            filter: {
                operator: LogicalOperator.AND,
                conditions: [
                    { field: 'userId', operator: FilterOperator.EQ, value: command.userId },
                    { field: 'courseId', operator: FilterOperator.EQ, value: command.courseId },
                ],
            },
        });

        if (existingEnrollment && existingEnrollment.status === 'active') {
            return { enrollmentId: existingEnrollment.id };
        }

        const enrollment = Enrollment.create({
            id: crypto.randomUUID(),
            userId: command.userId,
            courseId: command.courseId,
            enrolledAt: new Date(),
            expiresAt: command.expiresAt || null,
            paymentId: command.paymentId,
            addedByArtist: command.addedByArtist,
            status: 'active' as any,
            paymentType: command.expiresAt ? ('subscription' as any) : ('one-time' as any),
        });

        await this.enrollmentRepository.create(enrollment);

        return { enrollmentId: enrollment.id };
    }
}
