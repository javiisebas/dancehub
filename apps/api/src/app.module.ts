import { Module } from '@nestjs/common';
import { ArtistModule } from './modules/artist/artist.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { DatabaseModule } from './modules/core/database/database.module';
import { DanceStyleModule } from './modules/dance-style/dance-style.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [CoreModule, DatabaseModule, ArtistModule, AuthModule, UserModule, DanceStyleModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
