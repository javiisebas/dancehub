import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedLessonRequest } from '@repo/shared';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
    ILessonRepository,
    LESSON_REPOSITORY,
    LessonField,
    LessonRelations,
} from '../../domain/repositories/i-lesson.repository';

export class GetPaginatedLessonsQuery extends GetPaginatedQueryEnhanced<PaginatedLessonRequest> {}

@Injectable()
export class GetPaginatedLessonsHandler extends BaseGetPaginatedHandler<
    Lesson,
    PaginatedLessonRequest,
    LessonField,
    LessonRelations
> {
    constructor(@Inject(LESSON_REPOSITORY) repository: ILessonRepository) {
        super(repository);
    }
}
