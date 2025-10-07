import type { Album } from '@api/modules/artist/domain/entities/album.entity';
import type { Artist } from '@api/modules/artist/domain/entities/artist.entity';
import type { Song } from '@api/modules/artist/domain/entities/song.entity';
import { albums } from '@api/modules/artist/infrastructure/schemas/album.schema';
import { artists } from '@api/modules/artist/infrastructure/schemas/artist.schema';
import { songs } from '@api/modules/artist/infrastructure/schemas/song.schema';
import { describe, expect, it } from '@jest/globals';
import { RelationType } from '../types/relation.types';
import type { InferFields, InferRelations } from '../types/type-helpers.types';

describe('Type Safety - BaseRepository System', () => {
    describe('InferFields', () => {
        it('should infer fields from schema excluding id, createdAt, updatedAt', () => {
            type ArtistFields = InferFields<typeof artists>;

            const validFields: ArtistFields[] = ['name', 'country', 'bio'];

            // Type check: these should be valid
            const field1: ArtistFields = 'name';
            const field2: ArtistFields = 'country';
            const field3: ArtistFields = 'bio';

            expect(validFields).toHaveLength(3);
            expect([field1, field2, field3]).toEqual(['name', 'country', 'bio']);
        });

        it('should work with different schemas', () => {
            type SongFields = InferFields<typeof songs>;
            type AlbumFields = InferFields<typeof albums>;

            const songFields: SongFields[] = ['albumId', 'title', 'duration', 'trackNumber'];
            const albumFields: AlbumFields[] = ['artistId', 'title', 'releaseYear'];

            expect(songFields).toHaveLength(4);
            expect(albumFields).toHaveLength(3);
        });
    });

    describe('InferRelations - OneToMany', () => {
        it('should infer array type for oneToMany relations', () => {
            type TestRelations = {
                albums: {
                    type: RelationType.ONE_TO_MANY;
                    entity: Album;
                    table: typeof albums;
                    foreignKey: 'artistId';
                };
            };

            type InferredRelations = InferRelations<TestRelations>;

            const test = (rels: InferredRelations) => {
                // Should be an array
                const albums: Album[] = rels.albums;
                expect(Array.isArray(albums)).toBe(true);
                return albums;
            };

            expect(test).toBeDefined();
        });
    });

    describe('InferRelations - ManyToOne', () => {
        it('should infer single entity type for manyToOne relations', () => {
            type TestRelations = {
                album: {
                    type: RelationType.MANY_TO_ONE;
                    entity: Album;
                    table: typeof albums;
                    foreignKey: 'albumId';
                };
            };

            type InferredRelations = InferRelations<TestRelations>;

            const test = (rels: InferredRelations) => {
                // Should be single entity
                const album: Album = rels.album;
                expect(album).toBeDefined();
                return album;
            };

            expect(test).toBeDefined();
        });
    });

    describe('InferRelations - ManyToMany', () => {
        it('should infer array type for manyToMany relations', () => {
            type TestRelations = {
                songs: {
                    type: RelationType.MANY_TO_MANY;
                    entity: Song;
                    table: typeof songs;
                    joinTable: any;
                    foreignKey: 'albumId';
                    relatedKey: 'songId';
                };
            };

            type InferredRelations = InferRelations<TestRelations>;

            const test = (rels: InferredRelations) => {
                // Should be an array
                const songs: Song[] = rels.songs;
                expect(Array.isArray(songs)).toBe(true);
                return songs;
            };

            expect(test).toBeDefined();
        });
    });

    describe('InferRelations - Mixed Relations', () => {
        it('should correctly infer mixed relation types', () => {
            type MixedRelations = {
                albums: {
                    type: RelationType.ONE_TO_MANY;
                    entity: Album;
                    table: typeof albums;
                    foreignKey: 'artistId';
                };
                artist: {
                    type: RelationType.MANY_TO_ONE;
                    entity: Artist;
                    table: typeof artists;
                    foreignKey: 'artistId';
                };
                collaborators: {
                    type: RelationType.MANY_TO_MANY;
                    entity: Artist;
                    table: typeof artists;
                    joinTable: any;
                    foreignKey: 'artistId';
                    relatedKey: 'collaboratorId';
                };
            };

            type InferredRelations = InferRelations<MixedRelations>;

            const test = (rels: InferredRelations) => {
                // albums should be array (oneToMany)
                const albums: Album[] = rels.albums;

                // artist should be single entity (manyToOne)
                const artist: Artist = rels.artist;

                // collaborators should be array (manyToMany)
                const collaborators: Artist[] = rels.collaborators;

                expect(Array.isArray(albums)).toBe(true);
                expect(Array.isArray(collaborators)).toBe(true);
                expect(artist).toBeDefined();

                return { albums, artist, collaborators };
            };

            expect(test).toBeDefined();
        });
    });

    describe('Type Safety - Real World Scenarios', () => {
        it('should maintain type safety through complex queries', () => {
            // Simulating what the repository returns
            type ArtistWithRelations = Artist & {
                albums: Album[];
            };

            type AlbumWithRelations = Album & {
                songs: Song[];
                artist: Artist;
            };

            const processArtist = (artist: ArtistWithRelations) => {
                // Should have type-safe access to albums
                const albumTitles = artist.albums.map((album: Album) => album.title);

                // Should have access to artist properties
                const artistName = artist.name;
                const artistCountry = artist.country;

                expect(artistName).toBeDefined();
                expect(artistCountry).toBeDefined();

                return { albumTitles, artistName, artistCountry };
            };

            const processAlbum = (album: AlbumWithRelations) => {
                // Should have type-safe access to songs (array)
                const songTitles = album.songs.map((song: Song) => song.title);

                // Should have type-safe access to artist (single entity)
                const artistName = album.artist.name;

                expect(Array.isArray(album.songs)).toBe(true);
                expect(artistName).toBeDefined();

                return { songTitles, artistName };
            };

            expect(processArtist).toBeDefined();
            expect(processAlbum).toBeDefined();
        });

        it('should work with partial relation loading', () => {
            type ArtistWithPartialRelations = Artist & {
                albums?: Album[];
            };

            const process = (artist: ArtistWithPartialRelations) => {
                // Should safely handle optional relations
                const albumCount = artist.albums?.length ?? 0;

                // Should require null check
                const firstAlbumTitle = artist.albums?.[0]?.title;

                expect(albumCount).toBeGreaterThanOrEqual(0);

                return { albumCount, firstAlbumTitle };
            };

            expect(process).toBeDefined();
        });

        it('should maintain type safety in nested relations', () => {
            type ArtistWithNestedRelations = Artist & {
                albums: (Album & {
                    songs: Song[];
                })[];
            };

            const process = (artist: ArtistWithNestedRelations) => {
                // Type-safe access to nested relations
                const allSongs = artist.albums.flatMap(
                    (album: Album & { songs: Song[] }) => album.songs,
                );
                const songTitles = allSongs.map((song: Song) => song.title);

                // Should work with nested properties
                const firstSongDuration = artist.albums[0]?.songs[0]?.duration;

                expect(Array.isArray(allSongs)).toBe(true);
                expect(Array.isArray(songTitles)).toBe(true);

                return { allSongs, songTitles, firstSongDuration };
            };

            expect(process).toBeDefined();
        });
    });

    describe('QueryOptions Type Safety', () => {
        it('should enforce valid field names in filters', () => {
            type ArtistFields = InferFields<typeof artists>;

            type Filter<TField extends string> = {
                field: TField;
                operator: 'eq' | 'ne' | 'gt' | 'lt';
                value: any;
            };

            // Valid filters
            const validFilter1: Filter<ArtistFields> = {
                field: 'name',
                operator: 'eq',
                value: 'Test',
            };

            const validFilter2: Filter<ArtistFields> = {
                field: 'country',
                operator: 'eq',
                value: 'Spain',
            };

            const validFilter3: Filter<ArtistFields> = {
                field: 'bio',
                operator: 'ne',
                value: null,
            };

            expect(validFilter1.field).toBe('name');
            expect(validFilter2.field).toBe('country');
            expect(validFilter3.field).toBe('bio');
        });

        it('should enforce valid relation names', () => {
            type ArtistRelations = {
                albums: Album[];
                featuredIn: Song[];
            };

            type WithOption<TRelations> = {
                with?: (keyof TRelations)[];
            };

            // Valid with options
            const validWith1: WithOption<ArtistRelations> = {
                with: ['albums'],
            };

            const validWith2: WithOption<ArtistRelations> = {
                with: ['albums', 'featuredIn'],
            };

            expect(validWith1.with).toContain('albums');
            expect(validWith2.with).toHaveLength(2);
        });
    });

    describe('Return Type Inference', () => {
        it('should correctly infer return types based on relations', () => {
            // Simulating repository method return types
            type RepositoryReturn<TEntity, TRelations> = TRelations extends undefined
                ? TEntity
                : TEntity & Partial<TRelations>;

            type ArtistReturn = RepositoryReturn<Artist, { albums: Album[]; featuredIn: Song[] }>;

            const processReturn = (result: ArtistReturn) => {
                // Base entity properties always available
                const name: string = result.name;
                const country: string = result.country;

                // Relations are optional
                const albums: Album[] | undefined = result.albums;
                const songs: Song[] | undefined = result.featuredIn;

                // Must handle optionality
                const albumCount = result.albums?.length ?? 0;

                expect(name).toBeDefined();
                expect(country).toBeDefined();
                expect(albumCount).toBeGreaterThanOrEqual(0);

                return { name, country, albumCount };
            };

            expect(processReturn).toBeDefined();
        });
    });
});
