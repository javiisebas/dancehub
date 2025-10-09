import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateEnrollmentRequest } from '@repo/shared';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
    IEnrollmentRepository,
    ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/i-enrollment.repository';

export class UpdateEnrollmentCommand extends UpdateCommand<UpdateEnrollmentRequest> {}

@CommandHandler(UpdateEnrollmentCommand)
export class UpdateEnrollmentHandler implements ICommandHandler<UpdateEnrollmentCommand> {
    constructor(
        @Inject(ENROLLMENT_REPOSITORY) private readonly repository: IEnrollmentRepository,
    ) {}

    async execute(command: UpdateEnrollmentCommand): Promise<Enrollment> {
        const { id, data } = command;

        const enrollment = await this.repository.findById(id);
        if (!enrollment) {
            throw new NotFoundException('Enrollment');
        }

        if (data.enrolledAt !== undefined) {
            enrollment.enrolledAt = data.enrolledAt;
        }
        if (data.expiresAt !== undefined) {
            enrollment.expiresAt = data.expiresAt;
        }
        if (data.paymentId !== undefined) {
            enrollment.paymentId = data.paymentId;
        }
        if (data.addedByArtist !== undefined) {
            enrollment.addedByArtist = data.addedByArtist;
        }
        if (data.userId !== undefined) {
            enrollment.userId = data.userId;
        }
        if (data.courseId !== undefined) {
            enrollment.courseId = data.courseId;
        }

        return await this.repository.update(id, enrollment);
    }
}