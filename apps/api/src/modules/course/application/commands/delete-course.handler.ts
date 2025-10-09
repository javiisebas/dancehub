import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    COURSE_REPOSITORY,
    ICourseRepository,
} from '../../domain/repositories/i-course.repository';

export class DeleteCourseCommand extends DeleteCommand {}

@Injectable()
export class DeleteCourseHandler {
    constructor(
        @Inject(COURSE_REPOSITORY) private readonly repository: ICourseRepository,
    ) {}

    async execute({ id }: DeleteCourseCommand): Promise<void> {
        await this.repository.delete(id);
    }
}
