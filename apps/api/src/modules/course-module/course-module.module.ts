import { Module } from '@nestjs/common'; import {
CourseModuleController } from './infrastructure/controllers/course-module.controller';
import {
CourseModuleRepositoryImpl } from './infrastructure/repositories/course-module.repository'; import {
COURSE_MODULE_REPOSITORY } from './domain/repositories/i-course-module.repository';
import { CreateCourseModuleHandler } from './application/commands/create-course-module.handler'; import { UpdateCourseModuleHandler } from './application/commands/update-course-module.handler'; import { DeleteCourseModuleHandler } from './application/commands/delete-course-module.handler'; import { GetCourseModuleByFieldHandler } from './application/queries/get-course-module-by-field.handler'; import { FindManyCourseModulesHandler } from
'./application/queries/find-many-course-modules.handler'; import { GetPaginatedCourseModulesHandler } from './application/queries/get-paginated-course-modules.handler';
@Module({ controllers: [CourseModuleController], providers: [ { provide:
COURSE_MODULE_REPOSITORY, useClass:
CourseModuleRepositoryImpl, }, CreateCourseModuleHandler, UpdateCourseModuleHandler, DeleteCourseModuleHandler, GetCourseModuleByFieldHandler, FindManyCourseModulesHandler, GetPaginatedCourseModulesHandler, ], exports: [COURSE_MODULE_REPOSITORY], }) export class
CourseModuleModule {}