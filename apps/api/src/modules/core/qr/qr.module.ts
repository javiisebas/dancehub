import { Global, Module } from '@nestjs/common';
import { QrService } from './qr.service';

const providers = [QrService];

@Global()
@Module({
    providers,
    exports: providers,
})
export class AppQrModule {}
