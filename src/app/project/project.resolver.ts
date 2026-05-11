import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateProjectInput, Project, UpdateProjectInput } from './models/project.model';
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
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    return this.projectService.create(input, userId);
  }

  @Mutation(() => Project)
  @UseGuards(JwtAccessGuard)
  async updateProject(
    @Args('id') id: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<Project> {
    return this.projectService.update(id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteProject(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.projectService.delete(id);
  }
}
