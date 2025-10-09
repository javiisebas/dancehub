import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
    ILessonRepository,
    LESSON_REPOSITORY,
    LessonField,
    LessonRelations,
} from '../../domain/repositories/i-lesson.repository';

export class FindManyLessonsQuery extends FindManyQuery<LessonField, LessonRelations> {}

@Injectable()
export class FindManyLessonsHandler extends BaseFindManyHandler<Lesson, LessonField, LessonRelations> {
    constructor(@Inject(LESSON_REPOSITORY) repository: ILessonRepository) {
        super(repository);
    }
}
