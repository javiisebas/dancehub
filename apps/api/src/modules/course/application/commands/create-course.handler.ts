import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateCourseRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { CourseTranslation } from '../../domain/entities/course-translation.entity';
import { Course } from '../../domain/entities/course.entity';
import {
    COURSE_REPOSITORY,
    ICourseRepository,
} from '../../domain/repositories/i-course.repository';

export class CreateCourseCommand extends CreateCommand<CreateCourseRequest> {}

@Injectable()
export class CreateCourseHandler {
    constructor(
        @Inject(COURSE_REPOSITORY) private readonly repository: ICourseRepository,
    ) {}

    async execute({ data }: CreateCourseCommand) {
        const slugExists = await this.repository.slugExists(data.slug);
        if (slugExists) {
            throw new ConflictException('Slug already exists');
        }

        const course = Course.create(
            randomUUID(),
            data.slug,
            data.level,
            data.duration,
            data.price
,
            data.instructorId,
            data.danceStyleId

        );
        const translations = data.translations.map((t) =>
            CourseTranslation.create(randomUUID(), t.locale, t.name, t.description),
        );

        return this.repository.createWithTranslations(course, translations);
    }
}
