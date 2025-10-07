import { Module } from '@nestjs/common';
import { CreateAlbumHandler } from './application/commands/create-album.handler';
import { CreateArtistHandler } from './application/commands/create-artist.handler';
import { CreateSongHandler } from './application/commands/create-song.handler';
import { DeleteAlbumHandler } from './application/commands/delete-album.handler';
import { DeleteArtistHandler } from './application/commands/delete-artist.handler';
import { DeleteSongHandler } from './application/commands/delete-song.handler';
import { UpdateAlbumHandler } from './application/commands/update-album.handler';
import { UpdateArtistHandler } from './application/commands/update-artist.handler';
import { UpdateSongHandler } from './application/commands/update-song.handler';
import { FindManyAlbumsHandler } from './application/queries/find-many-albums.handler';
import { FindManyArtistsHandler } from './application/queries/find-many-artists.handler';
import { FindManySongsHandler } from './application/queries/find-many-songs.handler';
import { GetAlbumByFieldHandler } from './application/queries/get-album-by-field.handler';
import { GetArtistByFieldHandler } from './application/queries/get-artist-by-field.handler';
import { GetPaginatedAlbumsHandler } from './application/queries/get-paginated-albums.handler';
import { GetPaginatedArtistsHandler } from './application/queries/get-paginated-artists.handler';
import { GetPaginatedSongsHandler } from './application/queries/get-paginated-songs.handler';
import { GetSongByFieldHandler } from './application/queries/get-song-by-field.handler';
import { ALBUM_REPOSITORY } from './domain/repositories/i-album.repository';
import { ARTIST_REPOSITORY } from './domain/repositories/i-artist.repository';
import { SONG_REPOSITORY } from './domain/repositories/i-song.repository';
import { AlbumController } from './infrastructure/controllers/album.controller';
import { ArtistController } from './infrastructure/controllers/artist.controller';
import { SongController } from './infrastructure/controllers/song.controller';
import { AlbumRepositoryImpl } from './infrastructure/repositories/album.repository';
import { ArtistRepositoryImpl } from './infrastructure/repositories/artist.repository';
import { SongRepositoryImpl } from './infrastructure/repositories/song.repository';

@Module({
    controllers: [ArtistController, AlbumController, SongController],
    providers: [
        {
            provide: ARTIST_REPOSITORY,
            useClass: ArtistRepositoryImpl,
        },
        {
            provide: ALBUM_REPOSITORY,
            useClass: AlbumRepositoryImpl,
        },
        {
            provide: SONG_REPOSITORY,
            useClass: SongRepositoryImpl,
        },
        CreateArtistHandler,
        UpdateArtistHandler,
        DeleteArtistHandler,
        GetArtistByFieldHandler,
        FindManyArtistsHandler,
        GetPaginatedArtistsHandler,
        CreateAlbumHandler,
        UpdateAlbumHandler,
        DeleteAlbumHandler,
        GetAlbumByFieldHandler,
        FindManyAlbumsHandler,
        GetPaginatedAlbumsHandler,
        CreateSongHandler,
        UpdateSongHandler,
        DeleteSongHandler,
        GetSongByFieldHandler,
        FindManySongsHandler,
        GetPaginatedSongsHandler,
    ],
    exports: [ARTIST_REPOSITORY, ALBUM_REPOSITORY, SONG_REPOSITORY],
})
export class ArtistModule {}
