import { Body, Controller, Inject, Logger, Post, UseGuards } from '@nestjs/common';
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

type JobPayload = {
  userId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  traceId: string;
};

type OwidPayload = {
  userId: string;
  link: string;
  title: string;
  traceId: string;
};

const JOB_SEARCH_PROJECT = 'Job Search';

@Controller('pubsub')
export class PubSubController {
  private logger: Logger;
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    @Inject(TRACER_CLIENT) private readonly tracer: TracerClient,
  ) {
    this.logger = new Logger('pubsub.controller');
  }

  @Post('job-created')
  @UseGuards(OidcGuard)
  async onJobCreated(@Body() body: PubSubMessage): Promise<void> {
    const start = new Date();

    this.logger.log('job-created push sub activated');

    const payload: JobPayload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString('utf8'),
    );

    this.logger.log('payload:::', payload);

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

  @Post('job-interview-scheduled')
  @UseGuards(OidcGuard)
  async onInterviewScheduled(@Body() body: PubSubMessage): Promise<void> {
    const start = new Date();

    this.logger.log('job-interview-scheduled push sub activated');

    const payload: JobPayload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString('utf8'),
    );

    this.logger.log('payload:::', payload);

    const { userId, jobTitle, companyName, traceId } = payload;

    let project = await this.projectService.findByName(userId, JOB_SEARCH_PROJECT);
    if (!project) {
      project = await this.projectService.create({ name: JOB_SEARCH_PROJECT }, userId);
    }

    await this.taskService.create(
      {
        projectId: project.id,
        name: `Prep for interview: ${jobTitle} at ${companyName}`,
        status: TaskStatus.TODO,
      },
      userId,
    );

    this.tracer.sendSpan(traceId, 'POST /pubsub/job-interview-scheduled', start, new Date());
  }

  @Post('rube-owid')
  @UseGuards(OidcGuard)
  async onRubeOwid(@Body() body: PubSubMessage): Promise<void> {
    const start = new Date();

    const payload: OwidPayload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString('utf8'),
    );

    const { userId, title, link, traceId } = payload;

    let project = await this.projectService.findByName(userId, 'Interesting Topics');
    if (!project) {
      project = await this.projectService.create({ name: 'Interesting Topics' }, userId);
    }

    await this.taskService.create(
      {
        projectId: project.id,
        name: `Check out '${title}' on OWID`,
        description: link,
        status: TaskStatus.TODO,
      },
      userId,
    );

    this.tracer.sendSpan(traceId, 'POST /pubsub/rube-owid', start, new Date());
  }
}
