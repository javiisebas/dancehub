import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateVenueRequest, VenueResponse } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Venue } from '../../domain/entities/venue.entity';
import { IVenueRepository, VENUE_REPOSITORY } from '../../domain/repositories/i-venue.repository';
import { venueDanceStyles } from '../../infrastructure/schemas/venue-dance-style.schema';

export class CreateVenueCommand {
    constructor(public readonly data: CreateVenueRequest) {}
}

@CommandHandler(CreateVenueCommand)
export class CreateVenueHandler implements ICommandHandler<CreateVenueCommand> {
    constructor(
        @Inject(VENUE_REPOSITORY)
        private readonly venueRepository: IVenueRepository,
        private readonly databaseService: DatabaseService,
    ) {}

    async execute(command: CreateVenueCommand): Promise<VenueResponse> {
        const { data } = command;

        const venue = Venue.create(
            randomUUID(),
            data.name,
            data.slug,
            data.address,
            data.city,
            data.country,
            data.ownerId,
            data.capacity,
            data.hasParking,
        );

        const savedVenue = await this.venueRepository.save(venue);

        if (data.danceStyleIds && data.danceStyleIds.length > 0) {
            const danceStyleRelations = data.danceStyleIds.map((danceStyleId) => ({
                venueId: savedVenue.id,
                danceStyleId,
            }));

            await this.databaseService.db
                .insert(venueDanceStyles)
                .values(danceStyleRelations as any);
        }

        return this.toResponse(savedVenue);
    }

    private toResponse(venue: Venue): VenueResponse {
        return {
            id: venue.id,
            name: venue.name,
            slug: venue.slug,
            address: venue.address,
            city: venue.city,
            country: venue.country,
            capacity: venue.capacity,
            hasParking: venue.hasParking,
            ownerId: venue.ownerId,
            createdAt: venue.createdAt,
            updatedAt: venue.updatedAt,
        };
    }
}
