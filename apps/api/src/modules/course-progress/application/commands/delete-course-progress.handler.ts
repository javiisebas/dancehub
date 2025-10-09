import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    ICourseProgressRepository,
    COURSE_PROGRESS_REPOSITORY,
} from '../../domain/repositories/i-course-progress.repository';

export class DeleteCourseProgressCommand extends DeleteCommand {}

@Injectable()
export class DeleteCourseProgressHandler {
    constructor(
        @Inject(COURSE_PROGRESS_REPOSITORY) private readonly repository: ICourseProgressRepository,
    ) {}

    async execute({ id }: DeleteCourseProgressCommand): Promise<void> {
        await this.repository.delete(id);
    }
}