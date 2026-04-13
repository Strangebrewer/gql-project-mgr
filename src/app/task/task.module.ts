import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { TaskCollectionFactory } from '../../common/factory/task.factory';
import { TaskRepository } from './task.repository';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [SharedModule],
  providers: [
    TaskCollectionFactory,
    TaskRepository,
    TaskResolver,
    TaskService,
  ],
})
export class TaskModule {}
