import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateCourseProgressRequest,
    PaginatedCourseProgressRequest,
    UpdateCourseProgressRequest,
    CourseProgressPaginatedResponse,
    CourseProgressResponse,
} from '@repo/shared';
import {
    CreateCourseProgressCommand,
    CreateCourseProgressHandler,
} from '../../application/commands/create-course-progress.handler';
import {
    DeleteCourseProgressCommand,
    DeleteCourseProgressHandler,
} from '../../application/commands/delete-course-progress.handler';
import {
    UpdateCourseProgressCommand,
    UpdateCourseProgressHandler,
} from '../../application/commands/update-course-progress.handler';
import {
    FindManyCourseProgressesHandler,
    FindManyCourseProgressesQuery,
} from '../../application/queries/find-many-course-progresses.handler';
import {
    GetPaginatedCourseProgressesHandler,
    GetPaginatedCourseProgressesQuery,
} from '../../application/queries/get-paginated-course-progresses.handler';
import {
    GetCourseProgressByFieldHandler,
    GetCourseProgressByFieldQuery,
} from '../../application/queries/get-course-progress-by-field.handler';

@Controller('course-progresses')
export class CourseProgressController {
    constructor(
        private readonly createCourseProgressHandler: CreateCourseProgressHandler,
        private readonly updateCourseProgressHandler: UpdateCourseProgressHandler,
        private readonly deleteCourseProgressHandler: DeleteCourseProgressHandler,
        private readonly getCourseProgressByFieldHandler: GetCourseProgressByFieldHandler,
        private readonly findManyCourseProgressesHandler: FindManyCourseProgressesHandler,
        private readonly getPaginatedCourseProgressesHandler: GetPaginatedCourseProgressesHandler,
    ) {}

    @Post()
    @Serialize(CourseProgressResponse)
    async create(@Body() dto: CreateCourseProgressRequest) {
        const command = new CreateCourseProgressCommand(dto);
        return this.createCourseProgressHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(CourseProgressResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateCourseProgressRequest) {
        const command = new UpdateCourseProgressCommand(id, dto);
        return this.updateCourseProgressHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteCourseProgressCommand(id);
        await this.deleteCourseProgressHandler.execute(command);
    }

    @Get('search')
    @Serialize(CourseProgressResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyCourseProgressesQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyCourseProgressesHandler.execute(query);
    }

    @Get()
    @Serialize(CourseProgressPaginatedResponse)
    async paginate(@Query() dto: PaginatedCourseProgressRequest) {
        const query = new GetPaginatedCourseProgressesQuery(dto);
        return this.getPaginatedCourseProgressesHandler.execute(query);
    }

    @Get(':id')
    @Serialize(CourseProgressResponse)
    async findById(@Param('id') id: string) {
        const query = new GetCourseProgressByFieldQuery('id', id);
        return this.getCourseProgressByFieldHandler.execute(query);
    }
}