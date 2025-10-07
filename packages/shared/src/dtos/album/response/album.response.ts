import { Expose } from 'class-transformer';

export class AlbumResponse {
    @Expose()
    id!: string;

    @Expose()
    artistId!: string;

    @Expose()
    title!: string;

    @Expose()
    releaseYear!: number;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;
}
