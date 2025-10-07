import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateArtistRequest } from '@repo/shared';
import {
    ARTIST_REPOSITORY,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';

export class UpdateArtistCommand extends UpdateCommand<UpdateArtistRequest> {}

@Injectable()
export class UpdateArtistHandler {
    constructor(@Inject(ARTIST_REPOSITORY) private readonly repository: IArtistRepository) {}

    async execute(command: UpdateArtistCommand) {
        const { id, data } = command;
        const artist = await this.repository.findById(id);

        if (data.name) {
            artist.updateName(data.name);
        }

        return this.repository.save(artist);
    }
}
