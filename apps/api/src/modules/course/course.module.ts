import { Module } from '@nestjs/common'; import {
CourseController } from './infrastructure/controllers/course.controller';
import {
CourseRepositoryImpl } from './infrastructure/repositories/course.repository'; import {
COURSE_REPOSITORY } from './domain/repositories/i-course.repository';
import { CreateCourseHandler } from './application/commands/create-course.handler'; import { UpdateCourseHandler } from './application/commands/update-course.handler'; import { DeleteCourseHandler } from './application/commands/delete-course.handler'; import { GetCourseByFieldHandler } from './application/queries/get-course-by-field.handler'; import { FindManyCoursesHandler } from
'./application/queries/find-many-courses.handler'; import { GetPaginatedCoursesHandler } from './application/queries/get-paginated-courses.handler';
@Module({ controllers: [CourseController], providers: [ { provide:
COURSE_REPOSITORY, useClass:
CourseRepositoryImpl, }, CreateCourseHandler, UpdateCourseHandler, DeleteCourseHandler, GetCourseByFieldHandler, FindManyCoursesHandler, GetPaginatedCoursesHandler, ], exports: [COURSE_REPOSITORY], }) export class
CourseModule {}