import { Module } from '@nestjs/common'; import {
LessonAttachmentController } from './infrastructure/controllers/lesson-attachment.controller';
import {
LessonAttachmentRepositoryImpl } from './infrastructure/repositories/lesson-attachment.repository'; import {
LESSON_ATTACHMENT_REPOSITORY } from './domain/repositories/i-lesson-attachment.repository';
import { CreateLessonAttachmentHandler } from './application/commands/create-lesson-attachment.handler'; import { UpdateLessonAttachmentHandler } from './application/commands/update-lesson-attachment.handler'; import { DeleteLessonAttachmentHandler } from './application/commands/delete-lesson-attachment.handler'; import { GetLessonAttachmentByFieldHandler } from './application/queries/get-lesson-attachment-by-field.handler'; import { FindManyLessonAttachmentsHandler } from
'./application/queries/find-many-lesson-attachments.handler'; import { GetPaginatedLessonAttachmentsHandler } from './application/queries/get-paginated-lesson-attachments.handler';
@Module({ controllers: [LessonAttachmentController], providers: [ { provide:
LESSON_ATTACHMENT_REPOSITORY, useClass:
LessonAttachmentRepositoryImpl, }, CreateLessonAttachmentHandler, UpdateLessonAttachmentHandler, DeleteLessonAttachmentHandler, GetLessonAttachmentByFieldHandler, FindManyLessonAttachmentsHandler, GetPaginatedLessonAttachmentsHandler, ], exports: [LESSON_ATTACHMENT_REPOSITORY], }) export class
LessonAttachmentModule {}