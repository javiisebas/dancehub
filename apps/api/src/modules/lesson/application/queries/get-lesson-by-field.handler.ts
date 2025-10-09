import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
    ILessonRepository,
    LESSON_REPOSITORY,
    LessonField,
    LessonRelations,
} from '../../domain/repositories/i-lesson.repository';

export class GetLessonByFieldQuery extends GetByFieldQuery<LessonField, LessonRelations> {}

@Injectable()
export class GetLessonByFieldHandler extends BaseGetByFieldHandler<Lesson, LessonField, LessonRelations> {
    constructor(@Inject(LESSON_REPOSITORY) repository: ILessonRepository) {
        super(repository);
    }
}
