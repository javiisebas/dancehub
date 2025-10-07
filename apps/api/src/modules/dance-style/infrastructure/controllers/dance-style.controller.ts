import { CurrentLocale } from '@api/common/decorators/current-locale.decorator';
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
    FindManyDanceStylesHandler,
    FindManyDanceStylesQuery,
} from '../../application/queries/find-many-dance-styles.handler';
import {
    GetDanceStyleByFieldHandler,
    GetDanceStyleByFieldQuery,
} from '../../application/queries/get-dance-style-by-field.handler';
import {
    GetPaginatedDanceStylesHandler,
    GetPaginatedDanceStylesQuery,
} from '../../application/queries/get-paginated-dance-styles.handler';

@Controller('dance-styles')
export class DanceStyleController {
    constructor(
        private readonly createDanceStyleHandler: CreateDanceStyleHandler,
        private readonly updateDanceStyleHandler: UpdateDanceStyleHandler,
        private readonly deleteDanceStyleHandler: DeleteDanceStyleHandler,
        private readonly getDanceStyleByFieldHandler: GetDanceStyleByFieldHandler,
        private readonly findManyDanceStylesHandler: FindManyDanceStylesHandler,
        private readonly getPaginatedDanceStylesHandler: GetPaginatedDanceStylesHandler,
    ) {}

    @Post()
    @Serialize(DanceStyleResponse)
    async create(@Body() dto: CreateDanceStyleRequest) {
        const command = new CreateDanceStyleCommand(dto);
        return this.createDanceStyleHandler.execute(command);
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
        await this.deleteDanceStyleHandler.execute(command);
    }

    @Get('search')
    @Serialize(DanceStyleResponse)
    async search(
        @Query('locale') locale?: string,
        @Query('limit') limit?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const query = new FindManyDanceStylesQuery({
            locale: locale || localeHeader || undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyDanceStylesHandler.execute(query);
    }

    @Get('by-slug/:slug')
    @Serialize(DanceStyleResponse)
    async findBySlug(
        @Param('slug') slug: string,
        @Query('locale') localeParam?: string,
        @Query('includeAllTranslations') includeAll?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const locale = localeParam || localeHeader;
        const includeAllTranslations = includeAll === 'true' || !locale;
        const query = new GetDanceStyleByFieldQuery('slug', slug, {
            locale: locale || undefined,
            includeAllTranslations,
        });
        return this.getDanceStyleByFieldHandler.execute(query);
    }

    @Get()
    @Serialize(DanceStylePaginatedResponse)
    async paginate(
        @Query() dto: PaginatedDanceStyleRequest,
        @Query('locale') localeParam?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const query = new GetPaginatedDanceStylesQuery(dto, {
            locale: localeParam || localeHeader || undefined,
        });
        return this.getPaginatedDanceStylesHandler.execute(query);
    }

    @Get(':id')
    @Serialize(DanceStyleResponse)
    async findById(
        @Param('id') id: string,
        @Query('locale') localeParam?: string,
        @Query('includeAllTranslations') includeAll?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const locale = localeParam || localeHeader;
        const includeAllTranslations = includeAll === 'true' || !locale;
        const query = new GetDanceStyleByFieldQuery('id', id, {
            locale: locale || undefined,
            includeAllTranslations,
        });
        return this.getDanceStyleByFieldHandler.execute(query);
    }
}
