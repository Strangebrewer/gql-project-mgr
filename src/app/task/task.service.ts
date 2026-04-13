import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { DeleteResult } from '../../common/models/common.model';
import { TaskEntity } from './models/task.entity';
import { CreateTaskArgs, Task, TaskStatus, UpdateTaskArgs } from './models/task.model';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<Task> {
    const record = await this.taskRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Task not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const records = await this.taskRepository.find({ projectId });
    return records.map(mapToModel);
  }

  async create(args: CreateTaskArgs, userId: string): Promise<Task> {
    const entity: TaskEntity = {
      ...args,
      userId,
      id: this.idGenerator.generate('TSK'),
    };
    const record = await this.taskRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateTaskArgs): Promise<Task> {
    const record = await this.taskRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Task not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.taskRepository.deleteOne(id);
  }
}

function mapToModel(entity: TaskEntity): Task {
  return {
    id: entity.id,
    userId: entity.userId,
    projectId: entity.projectId,
    name: entity.name,
    description: entity.description,
    status: entity.status as TaskStatus,
    dueDate: entity.dueDate,
  };
}
