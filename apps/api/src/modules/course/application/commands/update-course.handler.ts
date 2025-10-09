import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { UpdateCourseRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { CourseTranslation } from '../../domain/entities/course-translation.entity';
import {
    COURSE_REPOSITORY,
    ICourseRepository,
} from '../../domain/repositories/i-course.repository';

export class UpdateCourseCommand extends UpdateCommand<UpdateCourseRequest> {}

@Injectable()
export class UpdateCourseHandler {
    constructor(
        @Inject(COURSE_REPOSITORY) private readonly repository: ICourseRepository,
    ) {}

    async execute({ id, data }: UpdateCourseCommand) {
        const course = await this.repository.findById(id);

        if (data.slug && data.slug !== course.slug) {
            const slugExists = await this.repository.slugExists(data.slug);
            if (slugExists) {
                throw new ConflictException('Slug already exists');
            }
            course.updateSlug(data.slug);
        }

        if (data.level !== undefined) course.updateLevel(data.level);
        if (data.duration !== undefined) course.updateDuration(data.duration);
        if (data.price !== undefined) course.updatePrice(data.price);
        if (data.instructorId !== undefined) course.instructorId = data.instructorId;
        if (data.danceStyleId !== undefined) course.danceStyleId = data.danceStyleId;

        const translations = data.translations?.map((t) =>
            CourseTranslation.create(randomUUID(), t.locale, t.name, t.description),
        );

        return this.repository.updateWithTranslations(course, translations);
    }
}
