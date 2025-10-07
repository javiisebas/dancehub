import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    ArtistPaginatedResponse,
    ArtistResponse,
    CreateArtistRequest,
    PaginatedArtistRequest,
    UpdateArtistRequest,
} from '@repo/shared';
import {
    CreateArtistCommand,
    CreateArtistHandler,
} from '../../application/commands/create-artist.handler';
import {
    DeleteArtistCommand,
    DeleteArtistHandler,
} from '../../application/commands/delete-artist.handler';
import {
    UpdateArtistCommand,
    UpdateArtistHandler,
} from '../../application/commands/update-artist.handler';
import {
    FindManyArtistsHandler,
    FindManyArtistsQuery,
} from '../../application/queries/find-many-artists.handler';
import {
    GetArtistByFieldHandler,
    GetArtistByFieldQuery,
} from '../../application/queries/get-artist-by-field.handler';
import {
    GetPaginatedArtistsHandler,
    GetPaginatedArtistsQuery,
} from '../../application/queries/get-paginated-artists.handler';

@Controller('artists')
export class ArtistController {
    constructor(
        private readonly createArtistHandler: CreateArtistHandler,
        private readonly updateArtistHandler: UpdateArtistHandler,
        private readonly deleteArtistHandler: DeleteArtistHandler,
        private readonly getArtistByFieldHandler: GetArtistByFieldHandler,
        private readonly findManyArtistsHandler: FindManyArtistsHandler,
        private readonly getPaginatedArtistsHandler: GetPaginatedArtistsHandler,
    ) {}

    @Post()
    @Serialize(ArtistResponse)
    async create(@Body() dto: CreateArtistRequest) {
        const command = new CreateArtistCommand(dto);
        return this.createArtistHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(ArtistResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateArtistRequest) {
        const command = new UpdateArtistCommand(id, dto);
        return this.updateArtistHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteArtistCommand(id);
        await this.deleteArtistHandler.execute(command);
    }

    @Get('search')
    @Serialize(ArtistResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyArtistsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyArtistsHandler.execute(query);
    }

    @Get('by-name/:name')
    @Serialize(ArtistResponse)
    async findByName(@Param('name') name: string) {
        const query = new GetArtistByFieldQuery('name', name);
        return this.getArtistByFieldHandler.execute(query);
    }

    @Get()
    @Serialize(ArtistPaginatedResponse)
    async paginate(@Query() dto: PaginatedArtistRequest) {
        const query = new GetPaginatedArtistsQuery(dto);
        return this.getPaginatedArtistsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(ArtistResponse)
    async findById(@Param('id') id: string) {
        const query = new GetArtistByFieldQuery('id', id);
        return this.getArtistByFieldHandler.execute(query);
    }
}
