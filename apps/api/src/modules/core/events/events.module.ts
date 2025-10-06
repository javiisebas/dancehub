import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

const Modules = [
    EventEmitterModule.forRoot({
        wildcard: true,
        delimiter: '.',
        newListener: false,
        removeListener: false,
    }),
];

@Global()
@Module({
    imports: [...Modules],
    exports: [...Modules],
})
export class EventsModule {}
