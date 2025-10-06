import { Module } from '@nestjs/common';
import { ArtistModule } from './modules/artist/artist.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { DatabaseModule } from './modules/core/database/database.module';
import { DanceStyleModule } from './modules/dance-style/dance-style.module';
import { UserModule } from './modules/user/user.module';
import { VenueModule } from './modules/venue/venue.module';

@Module({
    imports: [
        CoreModule,
        DatabaseModule,
        UserModule,
        DanceStyleModule,
        AuthModule,
        VenueModule,
        ArtistModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
