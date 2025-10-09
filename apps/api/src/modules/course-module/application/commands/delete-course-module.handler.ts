import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    ICourseModuleRepository,
    COURSE_MODULE_REPOSITORY,
} from '../../domain/repositories/i-course-module.repository';

export class DeleteCourseModuleCommand extends DeleteCommand {}

@Injectable()
export class DeleteCourseModuleHandler {
    constructor(
        @Inject(COURSE_MODULE_REPOSITORY) private readonly repository: ICourseModuleRepository,
    ) {}

    async execute({ id }: DeleteCourseModuleCommand): Promise<void> {
        await this.repository.delete(id);
    }
}