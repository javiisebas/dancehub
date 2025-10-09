import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateCourseModuleRequest,
    PaginatedCourseModuleRequest,
    UpdateCourseModuleRequest,
    CourseModulePaginatedResponse,
    CourseModuleResponse,
} from '@repo/shared';
import {
    CreateCourseModuleCommand,
    CreateCourseModuleHandler,
} from '../../application/commands/create-course-module.handler';
import {
    DeleteCourseModuleCommand,
    DeleteCourseModuleHandler,
} from '../../application/commands/delete-course-module.handler';
import {
    UpdateCourseModuleCommand,
    UpdateCourseModuleHandler,
} from '../../application/commands/update-course-module.handler';
import {
    FindManyCourseModulesHandler,
    FindManyCourseModulesQuery,
} from '../../application/queries/find-many-course-modules.handler';
import {
    GetPaginatedCourseModulesHandler,
    GetPaginatedCourseModulesQuery,
} from '../../application/queries/get-paginated-course-modules.handler';
import {
    GetCourseModuleByFieldHandler,
    GetCourseModuleByFieldQuery,
} from '../../application/queries/get-course-module-by-field.handler';

@Controller('course-modules')
export class CourseModuleController {
    constructor(
        private readonly createCourseModuleHandler: CreateCourseModuleHandler,
        private readonly updateCourseModuleHandler: UpdateCourseModuleHandler,
        private readonly deleteCourseModuleHandler: DeleteCourseModuleHandler,
        private readonly getCourseModuleByFieldHandler: GetCourseModuleByFieldHandler,
        private readonly findManyCourseModulesHandler: FindManyCourseModulesHandler,
        private readonly getPaginatedCourseModulesHandler: GetPaginatedCourseModulesHandler,
    ) {}

    @Post()
    @Serialize(CourseModuleResponse)
    async create(@Body() dto: CreateCourseModuleRequest) {
        const command = new CreateCourseModuleCommand(dto);
        return this.createCourseModuleHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(CourseModuleResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateCourseModuleRequest) {
        const command = new UpdateCourseModuleCommand(id, dto);
        return this.updateCourseModuleHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteCourseModuleCommand(id);
        await this.deleteCourseModuleHandler.execute(command);
    }

    @Get('search')
    @Serialize(CourseModuleResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyCourseModulesQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyCourseModulesHandler.execute(query);
    }

    @Get()
    @Serialize(CourseModulePaginatedResponse)
    async paginate(@Query() dto: PaginatedCourseModuleRequest) {
        const query = new GetPaginatedCourseModulesQuery(dto);
        return this.getPaginatedCourseModulesHandler.execute(query);
    }

    @Get(':id')
    @Serialize(CourseModuleResponse)
    async findById(@Param('id') id: string) {
        const query = new GetCourseModuleByFieldQuery('id', id);
        return this.getCourseModuleByFieldHandler.execute(query);
    }
}