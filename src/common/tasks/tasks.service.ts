import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async fetchDownloadVersionData() {
    try {
      console.log('do something');
    } catch (e) {
      this.logger.error(e);
    }
  }
}
