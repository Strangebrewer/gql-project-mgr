import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { DemoModule } from '../demo/demo.module';
import { PubSubController } from './pubsub.controller';

@Module({
  imports: [SharedModule, ProjectModule, TaskModule, DemoModule],
  controllers: [PubSubController],
})
export class PubSubModule {}
