import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { CreateProjectArgs, DeleteResult, Project, UpdateProjectArgs } from './project.model';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => Project)
  @UseGuards(JwtAccessGuard)
  async getProject(
    @Args('id') id: string,
  ): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Query(() => [Project])
  @UseGuards(JwtAccessGuard)
  async getProjects(
    @JwtUserId() userId: string,
  ): Promise<Project[]> {
    return this.projectService.find(userId);
  }

  @Mutation(() => Project)
  @UseGuards(JwtAccessGuard)
  async createProject(
    @JwtUserId() userId: string,
    @Args() args: CreateProjectArgs,
  ): Promise<Project> {
    return this.projectService.create(args, userId);
  }

  @Mutation(() => Project)
  @UseGuards(JwtAccessGuard)
  async updateProject(
    @Args('id') id: string,
    @Args() args: UpdateProjectArgs,
  ): Promise<Project> {
    return this.projectService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteProject(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.projectService.delete(id);
  }
}
