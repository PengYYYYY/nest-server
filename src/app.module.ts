import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

import config from './common/configs/config';
import { TasksService } from './common/tasks/tasks.service';

import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './common/health/health.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { JwtAuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: ['.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),
    CacheModule.register(),
    HealthModule,
    UserModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [TasksService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
