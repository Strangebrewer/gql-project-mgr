import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IsDemo, JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateTaskInput, Task, UpdateTaskInput } from './models/task.model';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => Task)
  @UseGuards(JwtAccessGuard)
  async getTask(@Args('id') id: string): Promise<Task> {
    return this.taskService.findById(id);
  }

  @Query(() => [Task])
  @UseGuards(JwtAccessGuard)
  async getTasksByProject(@Args('id') id: string): Promise<Task[]> {
    return this.taskService.findByProject(id);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAccessGuard)
  async createTask(
    @JwtUserId() userId: string,
    @IsDemo() isDemo: boolean,
    @Args('input') input: CreateTaskInput,
  ): Promise<Task> {
    return this.taskService.create(input, userId, { isDemo });
  }

  @Mutation(() => Task)
  @UseGuards(JwtAccessGuard)
  async updateTask(@Args('id') id: string, @Args('input') input: UpdateTaskInput): Promise<Task> {
    return this.taskService.update(id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteTask(@Args('id') id: string): Promise<DeleteResult> {
    return this.taskService.delete(id);
  }
}
