import { Body, Controller, Inject, Logger, Post, UseGuards } from '@nestjs/common';
import { OidcGuard } from '../../common/guards/oidc.guard';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';
import { DemoService } from '../demo/demo.service';
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
  expiresAt?: string;
};

type OwidPayload = {
  userId: string;
  link: string;
  title: string;
  traceId: string;
  expiresAt?: string;
};

type DemoRegisteredPayload = {
  userId: string;
  expiresAt: string;
  traceId?: string;
};

const JOB_SEARCH_PROJECT = 'Job Search';

@Controller('pubsub')
export class PubSubController {
  private logger: Logger;
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
    private readonly demoService: DemoService,
    @Inject(TRACER_CLIENT) private readonly tracer: TracerClient,
  ) {
    this.logger = new Logger('pubsub.controller');
  }

  @Post('job-interview-scheduled')
  @UseGuards(OidcGuard)
  async onInterviewScheduled(@Body() body: PubSubMessage): Promise<void> {
    const start = new Date();

    this.logger.log('job-interview-scheduled push sub activated');

    const payload: JobPayload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString('utf8'),
    );

    const { userId, jobTitle, companyName, traceId, expiresAt: expiresAtStr } = payload;
    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : undefined;

    let project = await this.projectService.findByName(userId, JOB_SEARCH_PROJECT);
    if (!project) {
      project = await this.projectService.create({ name: JOB_SEARCH_PROJECT }, userId, {
        expiresAt,
      });
    }

    await this.taskService.create(
      {
        projectId: project.id,
        name: `Prep for interview: ${jobTitle} at ${companyName}`,
        status: TaskStatus.TODO,
      },
      userId,
      { expiresAt },
    );

    this.tracer.sendSpan(traceId, 'POST /pubsub/job-interview-scheduled', start, new Date());
  }

  @Post('demo-registered')
  @UseGuards(OidcGuard)
  async onDemoRegistered(@Body() body: PubSubMessage): Promise<void> {
    let payload: DemoRegisteredPayload;
    try {
      payload = JSON.parse(Buffer.from(body.message.data, 'base64').toString('utf8'));
    } catch (err) {
      this.logger.error('failed to decode demo-registered payload', err);
      return;
    }
    const start = new Date();
    try {
      await this.demoService.seedDemoData(payload.userId, new Date(payload.expiresAt));
      this.tracer.sendSpan(payload.traceId, 'demo seed', start, new Date());
    } catch (err) {
      this.logger.error('failed to seed demo data', { userId: payload.userId, err });
      this.tracer.sendErrorSpan(payload.traceId, 'demo seed', String(err), start, new Date());
    }
  }

  @Post('rube-owid')
  @UseGuards(OidcGuard)
  async onRubeOwid(@Body() body: PubSubMessage): Promise<void> {
    const start = new Date();

    const payload: OwidPayload = JSON.parse(
      Buffer.from(body.message.data, 'base64').toString('utf8'),
    );

    const { userId, title, link, traceId, expiresAt: expiresAtStr } = payload;
    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : undefined;

    let project = await this.projectService.findByName(userId, 'Interesting Topics');
    if (!project) {
      project = await this.projectService.create({ name: 'Interesting Topics' }, userId, {
        expiresAt,
      });
    }

    await this.taskService.create(
      {
        projectId: project.id,
        name: `Check out '${title}' on OWID`,
        description: link,
        status: TaskStatus.TODO,
      },
      userId,
      { expiresAt },
    );

    this.tracer.sendSpan(traceId, 'POST /pubsub/rube-owid', start, new Date());
  }
}
