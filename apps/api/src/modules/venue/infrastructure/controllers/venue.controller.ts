import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateVenueRequest, VenueResponse } from '@repo/shared';
import { CreateVenueCommand } from '../../application/commands/create-venue.handler';
import { GetVenueQuery } from '../../application/queries/get-venue.handler';

@Controller('venues')
export class VenueController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @Post()
    async create(@Body() createVenueDto: CreateVenueRequest): Promise<VenueResponse> {
        return this.commandBus.execute(new CreateVenueCommand(createVenueDto));
    }

    @Get(':slug')
    async getBySlug(
        @Param('slug') slug: string,
        @Query('includeRelations') includeRelations?: string,
    ): Promise<VenueResponse> {
        return this.queryBus.execute(new GetVenueQuery(slug, includeRelations === 'true'));
    }
}
