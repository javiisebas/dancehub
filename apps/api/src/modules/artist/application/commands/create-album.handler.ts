import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateAlbumRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Album } from '../../domain/entities/album.entity';
import { ALBUM_REPOSITORY, IAlbumRepository } from '../../domain/repositories/i-album.repository';

export class CreateAlbumCommand extends CreateCommand<CreateAlbumRequest> {}

@Injectable()
export class CreateAlbumHandler {
    constructor(@Inject(ALBUM_REPOSITORY) private readonly repository: IAlbumRepository) {}

    async execute({ data }: CreateAlbumCommand) {
        const album = Album.create(randomUUID(), data.artistId, data.title, data.releaseYear);
        return this.repository.save(album);
    }
}
