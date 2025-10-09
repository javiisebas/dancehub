import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { LessonComment } from '../../domain/entities/lesson-comment.entity';
import {
    ILessonCommentRepository,
    LESSON_COMMENT_REPOSITORY,
    LessonCommentField,
    LessonCommentRelations,
} from '../../domain/repositories/i-lesson-comment.repository';

export class GetLessonCommentByFieldQuery extends GetByFieldQuery<LessonCommentField, LessonCommentRelations> {}

@Injectable()
export class GetLessonCommentByFieldHandler extends BaseGetByFieldHandler<LessonComment, LessonCommentField, LessonCommentRelations> {
    constructor(@Inject(LESSON_COMMENT_REPOSITORY) repository: ILessonCommentRepository) {
        super(repository);
    }
}
