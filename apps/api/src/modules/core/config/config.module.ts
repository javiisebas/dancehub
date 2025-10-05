import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { allConfig } from '@api/common/config/all-config';
import { TypedConfigService } from './config.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: allConfig,
            envFilePath: ['.env'],
        }),
    ],
    providers: [
        {
            provide: TypedConfigService,
            useClass: ConfigService,
        },
    ],
    exports: [ConfigModule, TypedConfigService],
})
export class AppConfigModule {}
