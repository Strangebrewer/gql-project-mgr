import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateTaskArgs, Task, UpdateTaskArgs } from './models/task.model';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => Task)
  @UseGuards(JwtAccessGuard)
  async getTask(
    @Args('id') id: string,
  ): Promise<Task> {
    return this.taskService.findById(id);
  }

  @Query(() => [Task])
  @UseGuards(JwtAccessGuard)
  async getTasksByProject(
    @Args('projectId') projectId: string,
  ): Promise<Task[]> {
    return this.taskService.findByProject(projectId);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAccessGuard)
  async createTask(
    @JwtUserId() userId: string,
    @Args() args: CreateTaskArgs,
  ): Promise<Task> {
    return this.taskService.create(args, userId);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAccessGuard)
  async updateTask(
    @Args('id') id: string,
    @Args() args: UpdateTaskArgs,
  ): Promise<Task> {
    return this.taskService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteTask(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.taskService.delete(id);
  }
}
