import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { TraceId } from '../../common/decorators/trace-id.decorator';
import { DeleteResult } from '../../common/models/common.model';
import { CreateProjectArgs, Project, UpdateProjectArgs } from './models/project.model';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => Project)
  @UseGuards(JwtAccessGuard)
  async getProject(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<Project> {
    return this.projectService.findById(id, traceId);
  }

  @Query(() => [Project])
  @UseGuards(JwtAccessGuard)
  async getProjects(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
  ): Promise<Project[]> {
    return this.projectService.find(userId, traceId);
  }

  @Mutation(() => Project)
  @UseGuards(JwtAccessGuard)
  async createProject(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateProjectArgs,
  ): Promise<Project> {
    return this.projectService.create(args, userId, traceId);
  }

  @Mutation(() => Project)
  @UseGuards(JwtAccessGuard)
  async updateProject(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateProjectArgs,
  ): Promise<Project> {
    return this.projectService.update(id, args, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteProject(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.projectService.delete(id, traceId);
  }
}
