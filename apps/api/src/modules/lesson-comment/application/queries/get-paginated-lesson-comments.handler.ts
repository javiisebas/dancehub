import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedLessonCommentRequest } from '@repo/shared';
import { LessonComment } from '../../domain/entities/lesson-comment.entity';
import {
    ILessonCommentRepository,
    LESSON_COMMENT_REPOSITORY,
    LessonCommentField,
    LessonCommentRelations,
} from '../../domain/repositories/i-lesson-comment.repository';

export class GetPaginatedLessonCommentsQuery extends GetPaginatedQueryEnhanced<PaginatedLessonCommentRequest> {}

@Injectable()
export class GetPaginatedLessonCommentsHandler extends BaseGetPaginatedHandler<
    LessonComment,
    PaginatedLessonCommentRequest,
    LessonCommentField,
    LessonCommentRelations
> {
    constructor(@Inject(LESSON_COMMENT_REPOSITORY) repository: ILessonCommentRepository) {
        super(repository);
    }
}
