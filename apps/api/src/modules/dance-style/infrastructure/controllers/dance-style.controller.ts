import { CurrentLocale } from '@api/common/decorators/current-locale.decorator';
import { IncludeAllTranslations } from '@api/common/decorators/include-all-translations.decorator';
import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateDanceStyleRequest,
    DanceStylePaginatedResponse,
    DanceStyleResponse,
    PaginatedDanceStyleRequest,
    UpdateDanceStyleRequest,
} from '@repo/shared';
import {
    CreateDanceStyleCommand,
    CreateDanceStyleHandler,
} from '../../application/commands/create-dance-style.handler';
import {
    DeleteDanceStyleCommand,
    DeleteDanceStyleHandler,
} from '../../application/commands/delete-dance-style.handler';
import {
    UpdateDanceStyleCommand,
    UpdateDanceStyleHandler,
} from '../../application/commands/update-dance-style.handler';
import {
    GetDanceStyleHandler,
    GetDanceStyleQuery,
} from '../../application/queries/get-dance-style.handler';
import {
    GetPaginatedDanceStylesHandler,
    GetPaginatedDanceStylesQuery,
} from '../../application/queries/get-paginated-dance-styles.handler';

@Controller('dance-styles')
export class DanceStyleController {
    constructor(
        private readonly createDanceStyleHandler: CreateDanceStyleHandler,
        private readonly deleteDanceStyleHandler: DeleteDanceStyleHandler,
        private readonly getDanceStyleHandler: GetDanceStyleHandler,
        private readonly getPaginatedDanceStylesHandler: GetPaginatedDanceStylesHandler,
        private readonly updateDanceStyleHandler: UpdateDanceStyleHandler,
    ) {}

    @Post()
    @Serialize(DanceStyleResponse)
    async create(@Body() dto: CreateDanceStyleRequest) {
        const command = new CreateDanceStyleCommand(dto);
        return this.createDanceStyleHandler.execute(command);
    }

    @Get()
    @Serialize(DanceStylePaginatedResponse)
    async paginate(@Query() dto: PaginatedDanceStyleRequest) {
        const query = new GetPaginatedDanceStylesQuery(dto);
        return this.getPaginatedDanceStylesHandler.executeQuery(query);
    }

    @Get(':id/all-translations')
    @IncludeAllTranslations()
    @Serialize(DanceStyleResponse)
    async findByIdWithAllTranslations(@Param('id') id: string) {
        const query = new GetDanceStyleQuery(id);
        return this.getDanceStyleHandler.executeQuery(query);
    }

    @Get(':id')
    @Serialize(DanceStyleResponse)
    async findById(@Param('id') id: string, @CurrentLocale() locale: string) {
        const query = new GetDanceStyleQuery(id, locale);
        return this.getDanceStyleHandler.executeQuery(query);
    }

    @Patch(':id')
    @Serialize(DanceStyleResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateDanceStyleRequest) {
        const command = new UpdateDanceStyleCommand(id, dto);
        return this.updateDanceStyleHandler.execute(command);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteDanceStyleCommand(id);
        await this.deleteDanceStyleHandler.executeCommand(command);
    }
}
