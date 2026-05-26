import { Injectable } from '@nestjs/common';
import { ProjectStatus } from '../project/models/project.model';
import { ProjectService } from '../project/project.service';
import { TaskStatus } from '../task/models/task.model';
import { TaskService } from '../task/task.service';

@Injectable()
export class DemoService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
  ) {}

  async seedDemoData(userId: string, expiresAt: Date): Promise<void> {
    const opts = { expiresAt };

    const [renovation, career] = await Promise.all([
      this.projectService.create(
        { name: 'Backyard Renovation', status: ProjectStatus.IN_PROGRESS },
        userId,
        opts,
      ),
      this.projectService.create(
        { name: 'Career Development', status: ProjectStatus.IN_PROGRESS },
        userId,
        opts,
      ),
    ]);

    await Promise.all([
      this.taskService.create(
        { projectId: renovation.id, name: 'Design the landscape layout', status: TaskStatus.TODO },
        userId,
        opts,
      ),
      this.taskService.create(
        {
          projectId: renovation.id,
          name: 'Get contractor quotes for the deck',
          status: TaskStatus.TODO,
        },
        userId,
        opts,
      ),
      this.taskService.create(
        { projectId: renovation.id, name: 'Order materials and supplies', status: TaskStatus.TODO },
        userId,
        opts,
      ),
      this.taskService.create(
        {
          projectId: renovation.id,
          name: 'Install drip irrigation system',
          status: TaskStatus.TODO,
        },
        userId,
        opts,
      ),
      this.taskService.create(
        { projectId: renovation.id, name: 'Plant perennials and shrubs', status: TaskStatus.TODO },
        userId,
        opts,
      ),
      this.taskService.create(
        {
          projectId: career.id,
          name: 'Complete GCP Professional Architect certification',
          status: TaskStatus.TODO,
        },
        userId,
        opts,
      ),
      this.taskService.create(
        {
          projectId: career.id,
          name: 'Publish portfolio writeup on Medium.com',
          status: TaskStatus.TODO,
        },
        userId,
        opts,
      ),
      this.taskService.create(
        {
          projectId: career.id,
          name: 'Build Terraform configuration for current infrastructure',
          status: TaskStatus.TODO,
        },
        userId,
        opts,
      ),
      this.taskService.create(
        {
          projectId: career.id,
          name: 'Read Designing Data-Intensive Applications',
          status: TaskStatus.TODO,
        },
        userId,
        opts,
      ),
      this.taskService.create(
        {
          projectId: career.id,
          name: 'Set up monitoring and alerting dashboard',
          status: TaskStatus.TODO,
        },
        userId,
        opts,
      ),
    ]);
  }
}
