import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateAlbumRequest } from '@repo/shared';
import { ALBUM_REPOSITORY, IAlbumRepository } from '../../domain/repositories/i-album.repository';

export class UpdateAlbumCommand extends UpdateCommand<UpdateAlbumRequest> {}

@Injectable()
export class UpdateAlbumHandler {
    constructor(@Inject(ALBUM_REPOSITORY) private readonly repository: IAlbumRepository) {}

    async execute(command: UpdateAlbumCommand) {
        const { id, data } = command;
        const album = await this.repository.findById(id);

        if (data.title) {
            album.updateTitle(data.title);
        }
        if (data.releaseYear !== undefined) {
            album.updateReleaseYear(data.releaseYear);
        }

        return this.repository.save(album);
    }
}
