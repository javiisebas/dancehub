import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@api/common/exceptions/not-found.exception';

import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { UpdateCourseModuleRequest } from '@repo/shared';
import { CourseModule } from '../../domain/entities/course-module.entity';
import {
    ICourseModuleRepository,
    COURSE_MODULE_REPOSITORY,
} from '../../domain/repositories/i-course-module.repository';

export class UpdateCourseModuleCommand extends UpdateCommand<UpdateCourseModuleRequest> {}

@CommandHandler(UpdateCourseModuleCommand)
export class UpdateCourseModuleHandler implements ICommandHandler<UpdateCourseModuleCommand> {
    constructor(
        @Inject(COURSE_MODULE_REPOSITORY) private readonly repository: ICourseModuleRepository,
    ) {}

    async execute(command: UpdateCourseModuleCommand): Promise<CourseModule> {
        const { id, data } = command;

        const courseModule = await this.repository.findById(id);
        if (!courseModule) {
            throw new NotFoundException('CourseModule');
        }

        if (data.name !== undefined) {
            courseModule.name = data.name;
        }
        if (data.description !== undefined) {
            courseModule.description = data.description;
        }
        if (data.order !== undefined) {
            courseModule.order = data.order;
        }
        if (data.courseId !== undefined) {
            courseModule.courseId = data.courseId;
        }

        return await this.repository.update(id, courseModule);
    }
}