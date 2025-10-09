import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateLessonCommentRequest,
    PaginatedLessonCommentRequest,
    UpdateLessonCommentRequest,
    LessonCommentPaginatedResponse,
    LessonCommentResponse,
} from '@repo/shared';
import {
    CreateLessonCommentCommand,
    CreateLessonCommentHandler,
} from '../../application/commands/create-lesson-comment.handler';
import {
    DeleteLessonCommentCommand,
    DeleteLessonCommentHandler,
} from '../../application/commands/delete-lesson-comment.handler';
import {
    UpdateLessonCommentCommand,
    UpdateLessonCommentHandler,
} from '../../application/commands/update-lesson-comment.handler';
import {
    FindManyLessonCommentsHandler,
    FindManyLessonCommentsQuery,
} from '../../application/queries/find-many-lesson-comments.handler';
import {
    GetPaginatedLessonCommentsHandler,
    GetPaginatedLessonCommentsQuery,
} from '../../application/queries/get-paginated-lesson-comments.handler';
import {
    GetLessonCommentByFieldHandler,
    GetLessonCommentByFieldQuery,
} from '../../application/queries/get-lesson-comment-by-field.handler';

@Controller('lesson-comments')
export class LessonCommentController {
    constructor(
        private readonly createLessonCommentHandler: CreateLessonCommentHandler,
        private readonly updateLessonCommentHandler: UpdateLessonCommentHandler,
        private readonly deleteLessonCommentHandler: DeleteLessonCommentHandler,
        private readonly getLessonCommentByFieldHandler: GetLessonCommentByFieldHandler,
        private readonly findManyLessonCommentsHandler: FindManyLessonCommentsHandler,
        private readonly getPaginatedLessonCommentsHandler: GetPaginatedLessonCommentsHandler,
    ) {}

    @Post()
    @Serialize(LessonCommentResponse)
    async create(@Body() dto: CreateLessonCommentRequest) {
        const command = new CreateLessonCommentCommand(dto);
        return this.createLessonCommentHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(LessonCommentResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateLessonCommentRequest) {
        const command = new UpdateLessonCommentCommand(id, dto);
        return this.updateLessonCommentHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteLessonCommentCommand(id);
        await this.deleteLessonCommentHandler.execute(command);
    }

    @Get('search')
    @Serialize(LessonCommentResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyLessonCommentsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyLessonCommentsHandler.execute(query);
    }

    @Get()
    @Serialize(LessonCommentPaginatedResponse)
    async paginate(@Query() dto: PaginatedLessonCommentRequest) {
        const query = new GetPaginatedLessonCommentsQuery(dto);
        return this.getPaginatedLessonCommentsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(LessonCommentResponse)
    async findById(@Param('id') id: string) {
        const query = new GetLessonCommentByFieldQuery('id', id);
        return this.getLessonCommentByFieldHandler.execute(query);
    }
}