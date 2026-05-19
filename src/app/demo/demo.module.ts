import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { DemoService } from './demo.service';

@Module({
  imports: [SharedModule, ProjectModule, TaskModule],
  providers: [DemoService],
  exports: [DemoService],
})
export class DemoModule {}
