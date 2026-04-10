import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectCollectionFactory } from './project.factory';
import { ProjectRepository } from './project.repository';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  imports: [SharedModule],
  providers: [
    ProjectCollectionFactory,
    ProjectRepository,
    ProjectResolver,
    ProjectService,
  ],
})
export class ProjectModule {}
