import { Module } from '@nestjs/common'; import {
LessonController } from './infrastructure/controllers/lesson.controller';
import {
LessonRepositoryImpl } from './infrastructure/repositories/lesson.repository'; import {
LESSON_REPOSITORY } from './domain/repositories/i-lesson.repository';
import { CreateLessonHandler } from './application/commands/create-lesson.handler'; import { UpdateLessonHandler } from './application/commands/update-lesson.handler'; import { DeleteLessonHandler } from './application/commands/delete-lesson.handler'; import { GetLessonByFieldHandler } from './application/queries/get-lesson-by-field.handler'; import { FindManyLessonsHandler } from
'./application/queries/find-many-lessons.handler'; import { GetPaginatedLessonsHandler } from './application/queries/get-paginated-lessons.handler';
@Module({ controllers: [LessonController], providers: [ { provide:
LESSON_REPOSITORY, useClass:
LessonRepositoryImpl, }, CreateLessonHandler, UpdateLessonHandler, DeleteLessonHandler, GetLessonByFieldHandler, FindManyLessonsHandler, GetPaginatedLessonsHandler, ], exports: [LESSON_REPOSITORY], }) export class
LessonModule {}