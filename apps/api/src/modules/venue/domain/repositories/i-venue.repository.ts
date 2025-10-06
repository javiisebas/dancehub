import { EntityWithRelations } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { VenueField } from '@repo/shared';
import { Venue } from '../entities/venue.entity';

export const VENUE_REPOSITORY = Symbol('VENUE_REPOSITORY');

export interface IVenueRepository extends IBaseRepository<Venue, VenueField> {
    findBySlug(
        slug: string,
        options?: { with?: string[] },
    ): Promise<Venue | EntityWithRelations<Venue, any> | null>;
}
