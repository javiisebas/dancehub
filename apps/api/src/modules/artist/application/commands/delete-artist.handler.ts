import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import {
    ARTIST_REPOSITORY,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';

export class DeleteArtistCommand extends DeleteCommand {}

@Injectable()
export class DeleteArtistHandler {
    constructor(@Inject(ARTIST_REPOSITORY) private readonly repository: IArtistRepository) {}

    async execute({ id }: DeleteArtistCommand): Promise<void> {
        await this.repository.delete(id);
    }
}
