import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateLessonAttachmentRequest,
    PaginatedLessonAttachmentRequest,
    UpdateLessonAttachmentRequest,
    LessonAttachmentPaginatedResponse,
    LessonAttachmentResponse,
} from '@repo/shared';
import {
    CreateLessonAttachmentCommand,
    CreateLessonAttachmentHandler,
} from '../../application/commands/create-lesson-attachment.handler';
import {
    DeleteLessonAttachmentCommand,
    DeleteLessonAttachmentHandler,
} from '../../application/commands/delete-lesson-attachment.handler';
import {
    UpdateLessonAttachmentCommand,
    UpdateLessonAttachmentHandler,
} from '../../application/commands/update-lesson-attachment.handler';
import {
    FindManyLessonAttachmentsHandler,
    FindManyLessonAttachmentsQuery,
} from '../../application/queries/find-many-lesson-attachments.handler';
import {
    GetPaginatedLessonAttachmentsHandler,
    GetPaginatedLessonAttachmentsQuery,
} from '../../application/queries/get-paginated-lesson-attachments.handler';
import {
    GetLessonAttachmentByFieldHandler,
    GetLessonAttachmentByFieldQuery,
} from '../../application/queries/get-lesson-attachment-by-field.handler';

@Controller('lesson-attachments')
export class LessonAttachmentController {
    constructor(
        private readonly createLessonAttachmentHandler: CreateLessonAttachmentHandler,
        private readonly updateLessonAttachmentHandler: UpdateLessonAttachmentHandler,
        private readonly deleteLessonAttachmentHandler: DeleteLessonAttachmentHandler,
        private readonly getLessonAttachmentByFieldHandler: GetLessonAttachmentByFieldHandler,
        private readonly findManyLessonAttachmentsHandler: FindManyLessonAttachmentsHandler,
        private readonly getPaginatedLessonAttachmentsHandler: GetPaginatedLessonAttachmentsHandler,
    ) {}

    @Post()
    @Serialize(LessonAttachmentResponse)
    async create(@Body() dto: CreateLessonAttachmentRequest) {
        const command = new CreateLessonAttachmentCommand(dto);
        return this.createLessonAttachmentHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(LessonAttachmentResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateLessonAttachmentRequest) {
        const command = new UpdateLessonAttachmentCommand(id, dto);
        return this.updateLessonAttachmentHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteLessonAttachmentCommand(id);
        await this.deleteLessonAttachmentHandler.execute(command);
    }

    @Get('search')
    @Serialize(LessonAttachmentResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyLessonAttachmentsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyLessonAttachmentsHandler.execute(query);
    }

    @Get()
    @Serialize(LessonAttachmentPaginatedResponse)
    async paginate(@Query() dto: PaginatedLessonAttachmentRequest) {
        const query = new GetPaginatedLessonAttachmentsQuery(dto);
        return this.getPaginatedLessonAttachmentsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(LessonAttachmentResponse)
    async findById(@Param('id') id: string) {
        const query = new GetLessonAttachmentByFieldQuery('id', id);
        return this.getLessonAttachmentByFieldHandler.execute(query);
    }
}