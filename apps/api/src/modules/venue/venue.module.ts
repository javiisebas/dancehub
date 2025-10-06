import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateVenueHandler } from './application/commands/create-venue.handler';
import { GetVenueHandler } from './application/queries/get-venue.handler';
import { VENUE_REPOSITORY } from './domain/repositories/i-venue.repository';
import { VenueController } from './infrastructure/controllers/venue.controller';
import { VenueRepositoryImpl } from './infrastructure/repositories/venue.repository';

@Module({
    imports: [CqrsModule],
    controllers: [VenueController],
    providers: [
        {
            provide: VENUE_REPOSITORY,
            useClass: VenueRepositoryImpl,
        },
        CreateVenueHandler,
        GetVenueHandler,
    ],
    exports: [VENUE_REPOSITORY],
})
export class VenueModule {}
