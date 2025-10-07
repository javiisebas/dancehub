import { Expose } from 'class-transformer';

export class SongResponse {
    @Expose()
    id!: string;

    @Expose()
    albumId!: string;

    @Expose()
    artistId!: string;

    @Expose()
    title!: string;

    @Expose()
    duration!: number;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;
}
