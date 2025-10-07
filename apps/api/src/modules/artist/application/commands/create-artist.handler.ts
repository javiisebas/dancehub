import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateArtistRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Artist } from '../../domain/entities/artist.entity';
import {
    ARTIST_REPOSITORY,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';

export class CreateArtistCommand extends CreateCommand<CreateArtistRequest> {}

@Injectable()
export class CreateArtistHandler {
    constructor(@Inject(ARTIST_REPOSITORY) private readonly repository: IArtistRepository) {}

    async execute({ data }: CreateArtistCommand) {
        const artist = Artist.create(randomUUID(), data.name);
        return this.repository.save(artist);
    }
}
