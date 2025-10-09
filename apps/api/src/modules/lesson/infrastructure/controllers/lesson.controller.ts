import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateLessonRequest,
    PaginatedLessonRequest,
    UpdateLessonRequest,
    LessonPaginatedResponse,
    LessonResponse,
} from '@repo/shared';
import {
    CreateLessonCommand,
    CreateLessonHandler,
} from '../../application/commands/create-lesson.handler';
import {
    DeleteLessonCommand,
    DeleteLessonHandler,
} from '../../application/commands/delete-lesson.handler';
import {
    UpdateLessonCommand,
    UpdateLessonHandler,
} from '../../application/commands/update-lesson.handler';
import {
    FindManyLessonsHandler,
    FindManyLessonsQuery,
} from '../../application/queries/find-many-lessons.handler';
import {
    GetPaginatedLessonsHandler,
    GetPaginatedLessonsQuery,
} from '../../application/queries/get-paginated-lessons.handler';
import {
    GetLessonByFieldHandler,
    GetLessonByFieldQuery,
} from '../../application/queries/get-lesson-by-field.handler';

@Controller('lessons')
export class LessonController {
    constructor(
        private readonly createLessonHandler: CreateLessonHandler,
        private readonly updateLessonHandler: UpdateLessonHandler,
        private readonly deleteLessonHandler: DeleteLessonHandler,
        private readonly getLessonByFieldHandler: GetLessonByFieldHandler,
        private readonly findManyLessonsHandler: FindManyLessonsHandler,
        private readonly getPaginatedLessonsHandler: GetPaginatedLessonsHandler,
    ) {}

    @Post()
    @Serialize(LessonResponse)
    async create(@Body() dto: CreateLessonRequest) {
        const command = new CreateLessonCommand(dto);
        return this.createLessonHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(LessonResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateLessonRequest) {
        const command = new UpdateLessonCommand(id, dto);
        return this.updateLessonHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteLessonCommand(id);
        await this.deleteLessonHandler.execute(command);
    }

    @Get('search')
    @Serialize(LessonResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyLessonsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyLessonsHandler.execute(query);
    }

    @Get()
    @Serialize(LessonPaginatedResponse)
    async paginate(@Query() dto: PaginatedLessonRequest) {
        const query = new GetPaginatedLessonsQuery(dto);
        return this.getPaginatedLessonsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(LessonResponse)
    async findById(@Param('id') id: string) {
        const query = new GetLessonByFieldQuery('id', id);
        return this.getLessonByFieldHandler.execute(query);
    }
}