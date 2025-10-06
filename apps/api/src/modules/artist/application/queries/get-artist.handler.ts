import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
    ARTIST_REPOSITORY,
    IArtistRepository,
} from '../../domain/repositories/i-artist.repository';

export class GetArtistQuery {
    constructor(
        public readonly id: string,
        public readonly includeRelations: boolean,
    ) {}
}

@QueryHandler(GetArtistQuery)
export class GetArtistHandler implements IQueryHandler<GetArtistQuery> {
    constructor(
        @Inject(ARTIST_REPOSITORY)
        private readonly artistRepository: IArtistRepository,
    ) {}

    async execute(query: GetArtistQuery): Promise<any> {
        const { id, includeRelations } = query;

        let artist;
        if (includeRelations) {
            artist = await (this.artistRepository as any).findById(id, { with: ['albums.songs'] });
        } else {
            artist = await this.artistRepository.findById(id);
        }

        if (!artist) {
            throw new NotFoundException(`Artist with id ${id} not found`);
        }

        return this.toResponse(artist);
    }

    private toResponse(artist: any): any {
        const response: any = {
            id: artist.id,
            name: artist.name,
            country: artist.country,
            bio: artist.bio,
            createdAt: artist.createdAt,
            updatedAt: artist.updatedAt,
        };

        if (artist.albums) {
            response.albums = artist.albums.map((album: any) => {
                const albumData: any = {
                    id: album.id,
                    title: album.title,
                    releaseYear: album.releaseYear,
                    createdAt: album.createdAt,
                    updatedAt: album.updatedAt,
                };

                if (album.songs) {
                    albumData.songs = album.songs.map((song: any) => ({
                        id: song.id,
                        title: song.title,
                        duration: song.duration,
                        trackNumber: song.trackNumber,
                        createdAt: song.createdAt,
                        updatedAt: song.updatedAt,
                    }));
                }

                return albumData;
            });
        }

        return response;
    }
}
