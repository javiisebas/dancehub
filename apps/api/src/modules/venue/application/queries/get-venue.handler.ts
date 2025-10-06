import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { VenueResponse } from '@repo/shared';
import { IVenueRepository, VENUE_REPOSITORY } from '../../domain/repositories/i-venue.repository';

export class GetVenueQuery {
    constructor(
        public readonly slug: string,
        public readonly includeRelations: boolean = false,
    ) {}
}

@QueryHandler(GetVenueQuery)
export class GetVenueHandler implements IQueryHandler<GetVenueQuery> {
    constructor(
        @Inject(VENUE_REPOSITORY)
        private readonly venueRepository: IVenueRepository,
    ) {}

    async execute(query: GetVenueQuery): Promise<VenueResponse> {
        const { slug, includeRelations } = query;

        const venue = await this.venueRepository.findBySlug(
            slug,
            includeRelations ? { with: ['owner', 'danceStyles'] } : undefined,
        );

        if (!venue) {
            throw new NotFoundException(`Venue with slug ${slug} not found`);
        }

        return includeRelations ? this.toResponseWithRelations(venue) : this.toResponse(venue);
    }

    private toResponse(venue: any): VenueResponse {
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

    private toResponseWithRelations(venue: any): VenueResponse {
        return {
            ...this.toResponse(venue),
            owner: venue.owner
                ? {
                      id: venue.owner.id,
                      email: venue.owner.email,
                      name: venue.owner.name,
                      displayName: venue.owner.displayName,
                  }
                : undefined,
            danceStyles: venue.danceStyles
                ? venue.danceStyles.map((ds: any) => ({
                      id: ds.id,
                      slug: ds.slug,
                  }))
                : undefined,
        };
    }
}
