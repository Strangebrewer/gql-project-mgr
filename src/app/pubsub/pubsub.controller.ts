import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { OidcGuard } from '../../common/guards/oidc.guard';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';
import { ProjectService } from '../project/project.service';
import { TaskService } from '../task/task.service';
import { TaskStatus } from '../task/models/task.model';

type PubSubMessage = {
  message: {
    data: string;
    messageId: string;
    publishTime: string;
  };
  subscription: string;
};

type JobCreatedPayload = {
  userId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  traceId: string;
};

const JOB_SEARCH_PROJECT = 'Job Search';

@Controller('pubsub')
export class PubSubController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    @Inject(TRACER_CLIENT) private readonly tracer: TracerClient,
  ) {}

  @Post('job-created')
  @UseGuards(OidcGuard)
  async onJobCreated(@Body() body: PubSubMessage): Promise<void> {
    const start = new Date();

    const payload: JobCreatedPayload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString('utf8'),
    );

    const { userId, jobTitle, companyName, traceId } = payload;

    let project = await this.projectService.findByName(userId, JOB_SEARCH_PROJECT);
    if (!project) {
      project = await this.projectService.create({ name: JOB_SEARCH_PROJECT }, userId);
    }

    await this.taskService.create(
      { projectId: project.id, name: `${jobTitle} at ${companyName}`, status: TaskStatus.TODO },
      userId,
    );

    this.tracer.sendSpan(traceId, 'POST /pubsub/job-created', start, new Date());
  }
}
