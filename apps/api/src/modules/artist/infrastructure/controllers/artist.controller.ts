import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetArtistQuery } from '../../application/queries/get-artist.handler';

@Controller('artists')
export class ArtistController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get(':id')
    async getById(
        @Param('id') id: string,
        @Query('includeRelations') includeRelations?: string,
    ): Promise<any> {
        return this.queryBus.execute(new GetArtistQuery(id, includeRelations === 'true'));
    }
}
