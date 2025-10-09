import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCourseModuleRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { CourseModule } from '../../domain/entities/course-module.entity';
import {
    ICourseModuleRepository,
    COURSE_MODULE_REPOSITORY,
} from '../../domain/repositories/i-course-module.repository';

export class CreateCourseModuleCommand extends CreateCommand<CreateCourseModuleRequest> {}

@Injectable()
export class CreateCourseModuleHandler {
    constructor(
        @Inject(COURSE_MODULE_REPOSITORY) private readonly repository: ICourseModuleRepository,
    ) {}

    async execute({ data }: CreateCourseModuleCommand) {
        const courseModule = CourseModule.create({
            id: randomUUID(),
            name: data.name,
            description: data.description,
            order: data.order,
            courseId: data.courseId,
        });

        return this.repository.save(courseModule);
    }
}