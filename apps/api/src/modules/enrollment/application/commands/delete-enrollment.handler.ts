import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    IEnrollmentRepository,
    ENROLLMENT_REPOSITORY,
} from '../../domain/repositories/i-enrollment.repository';

export class DeleteEnrollmentCommand extends DeleteCommand {}

@Injectable()
export class DeleteEnrollmentHandler {
    constructor(
        @Inject(ENROLLMENT_REPOSITORY) private readonly repository: IEnrollmentRepository,
    ) {}

    async execute({ id }: DeleteEnrollmentCommand): Promise<void> {
        await this.repository.delete(id);
    }
}