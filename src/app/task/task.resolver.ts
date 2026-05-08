import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { TraceId } from '../../common/decorators/trace-id.decorator';
import { DeleteResult } from '../../common/models/common.model';
import { CreateTaskArgs, Task, UpdateTaskArgs } from './models/task.model';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => Task)
  @UseGuards(JwtAccessGuard)
  async getTask(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<Task> {
    return this.taskService.findById(id, traceId);
  }

  @Query(() => [Task])
  @UseGuards(JwtAccessGuard)
  async getTasksByProject(
    @TraceId() traceId: string,
    @Args('projectId') projectId: string,
  ): Promise<Task[]> {
    return this.taskService.findByProject(projectId, traceId);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAccessGuard)
  async createTask(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateTaskArgs,
  ): Promise<Task> {
    return this.taskService.create(args, userId, traceId);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAccessGuard)
  async updateTask(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateTaskArgs,
  ): Promise<Task> {
    return this.taskService.update(id, args, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteTask(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.taskService.delete(id, traceId);
  }
}
