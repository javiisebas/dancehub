import { Module } from '@nestjs/common'; import {
LessonCommentController } from './infrastructure/controllers/lesson-comment.controller';
import {
LessonCommentRepositoryImpl } from './infrastructure/repositories/lesson-comment.repository'; import {
LESSON_COMMENT_REPOSITORY } from './domain/repositories/i-lesson-comment.repository';
import { CreateLessonCommentHandler } from './application/commands/create-lesson-comment.handler'; import { UpdateLessonCommentHandler } from './application/commands/update-lesson-comment.handler'; import { DeleteLessonCommentHandler } from './application/commands/delete-lesson-comment.handler'; import { GetLessonCommentByFieldHandler } from './application/queries/get-lesson-comment-by-field.handler'; import { FindManyLessonCommentsHandler } from
'./application/queries/find-many-lesson-comments.handler'; import { GetPaginatedLessonCommentsHandler } from './application/queries/get-paginated-lesson-comments.handler';
@Module({ controllers: [LessonCommentController], providers: [ { provide:
LESSON_COMMENT_REPOSITORY, useClass:
LessonCommentRepositoryImpl, }, CreateLessonCommentHandler, UpdateLessonCommentHandler, DeleteLessonCommentHandler, GetLessonCommentByFieldHandler, FindManyLessonCommentsHandler, GetPaginatedLessonCommentsHandler, ], exports: [LESSON_COMMENT_REPOSITORY], }) export class
LessonCommentModule {}