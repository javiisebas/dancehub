import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    AlbumPaginatedResponse,
    AlbumResponse,
    CreateAlbumRequest,
    PaginatedAlbumRequest,
    UpdateAlbumRequest,
} from '@repo/shared';
import {
    CreateAlbumCommand,
    CreateAlbumHandler,
} from '../../application/commands/create-album.handler';
import {
    DeleteAlbumCommand,
    DeleteAlbumHandler,
} from '../../application/commands/delete-album.handler';
import {
    UpdateAlbumCommand,
    UpdateAlbumHandler,
} from '../../application/commands/update-album.handler';
import {
    FindManyAlbumsHandler,
    FindManyAlbumsQuery,
} from '../../application/queries/find-many-albums.handler';
import {
    GetAlbumByFieldHandler,
    GetAlbumByFieldQuery,
} from '../../application/queries/get-album-by-field.handler';
import {
    GetPaginatedAlbumsHandler,
    GetPaginatedAlbumsQuery,
} from '../../application/queries/get-paginated-albums.handler';

@Controller('albums')
export class AlbumController {
    constructor(
        private readonly createAlbumHandler: CreateAlbumHandler,
        private readonly updateAlbumHandler: UpdateAlbumHandler,
        private readonly deleteAlbumHandler: DeleteAlbumHandler,
        private readonly getAlbumByFieldHandler: GetAlbumByFieldHandler,
        private readonly findManyAlbumsHandler: FindManyAlbumsHandler,
        private readonly getPaginatedAlbumsHandler: GetPaginatedAlbumsHandler,
    ) {}

    @Post()
    @Serialize(AlbumResponse)
    async create(@Body() dto: CreateAlbumRequest) {
        const command = new CreateAlbumCommand(dto);
        return this.createAlbumHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(AlbumResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateAlbumRequest) {
        const command = new UpdateAlbumCommand(id, dto);
        return this.updateAlbumHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteAlbumCommand(id);
        await this.deleteAlbumHandler.execute(command);
    }

    @Get('search')
    @Serialize(AlbumResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyAlbumsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyAlbumsHandler.execute(query);
    }

    @Get()
    @Serialize(AlbumPaginatedResponse)
    async paginate(@Query() dto: PaginatedAlbumRequest) {
        const query = new GetPaginatedAlbumsQuery(dto);
        return this.getPaginatedAlbumsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(AlbumResponse)
    async findById(@Param('id') id: string) {
        const query = new GetAlbumByFieldQuery('id', id);
        return this.getAlbumByFieldHandler.execute(query);
    }
}
