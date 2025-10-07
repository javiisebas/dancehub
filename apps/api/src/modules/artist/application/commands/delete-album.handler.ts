import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { ALBUM_REPOSITORY, IAlbumRepository } from '../../domain/repositories/i-album.repository';

export class DeleteAlbumCommand extends DeleteCommand {}

@Injectable()
export class DeleteAlbumHandler {
    constructor(@Inject(ALBUM_REPOSITORY) private readonly repository: IAlbumRepository) {}

    async execute({ id }: DeleteAlbumCommand): Promise<void> {
        await this.repository.delete(id);
    }
}
