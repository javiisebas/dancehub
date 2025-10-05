import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './redis.health';

@Module({
    controllers: [HealthController],
    imports: [TerminusModule, HttpModule],
    providers: [RedisHealthIndicator],
})
export class HealthModule {}
