import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateSongRequest,
    PaginatedSongRequest,
    SongPaginatedResponse,
    SongResponse,
    UpdateSongRequest,
} from '@repo/shared';
import {
    CreateSongCommand,
    CreateSongHandler,
} from '../../application/commands/create-song.handler';
import {
    DeleteSongCommand,
    DeleteSongHandler,
} from '../../application/commands/delete-song.handler';
import {
    UpdateSongCommand,
    UpdateSongHandler,
} from '../../application/commands/update-song.handler';
import {
    FindManySongsHandler,
    FindManySongsQuery,
} from '../../application/queries/find-many-songs.handler';
import {
    GetPaginatedSongsHandler,
    GetPaginatedSongsQuery,
} from '../../application/queries/get-paginated-songs.handler';
import {
    GetSongByFieldHandler,
    GetSongByFieldQuery,
} from '../../application/queries/get-song-by-field.handler';

@Controller('songs')
export class SongController {
    constructor(
        private readonly createSongHandler: CreateSongHandler,
        private readonly updateSongHandler: UpdateSongHandler,
        private readonly deleteSongHandler: DeleteSongHandler,
        private readonly getSongByFieldHandler: GetSongByFieldHandler,
        private readonly findManySongsHandler: FindManySongsHandler,
        private readonly getPaginatedSongsHandler: GetPaginatedSongsHandler,
    ) {}

    @Post()
    @Serialize(SongResponse)
    async create(@Body() dto: CreateSongRequest) {
        const command = new CreateSongCommand(dto);
        return this.createSongHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(SongResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateSongRequest) {
        const command = new UpdateSongCommand(id, dto);
        return this.updateSongHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteSongCommand(id);
        await this.deleteSongHandler.execute(command);
    }

    @Get('search')
    @Serialize(SongResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManySongsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManySongsHandler.execute(query);
    }

    @Get()
    @Serialize(SongPaginatedResponse)
    async paginate(@Query() dto: PaginatedSongRequest) {
        const query = new GetPaginatedSongsQuery(dto);
        return this.getPaginatedSongsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(SongResponse)
    async findById(@Param('id') id: string) {
        const query = new GetSongByFieldQuery('id', id);
        return this.getSongByFieldHandler.execute(query);
    }
}
