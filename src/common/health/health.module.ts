import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { CustomHealthIndicator } from './custom.health';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [CustomHealthIndicator],
  exports: [CustomHealthIndicator, TerminusModule],
})
export class HealthModule {}
