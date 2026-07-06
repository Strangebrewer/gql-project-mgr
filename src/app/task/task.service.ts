import { randomUUID } from 'crypto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { TaskEntity } from './models/task.entity';
import { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from './models/task.model';
import { TaskRepository } from './task.repository';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findById(id: string): Promise<Task> {
    const record = await this.taskRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Task');
    }
    return mapToModel(record);
  }

  async findByProject(projectId: string): Promise<Task[]> {
    const records = await this.taskRepository.find({ projectId });
    return records.map(mapToModel);
  }

  async create(
    args: CreateTaskInput,
    userId: string,
    options?: { isDemo?: boolean; expiresAt?: Date },
  ): Promise<Task> {
    if (options?.isDemo) {
      const count = await this.taskRepository.count({ projectId: args.projectId });
      if (count >= 50) throw new ForbiddenException('demo task limit reached');
    }
    const entity: TaskEntity = {
      ...args,
      userId,
      _id: randomUUID(),
      ...(options?.expiresAt && { expiresAt: options.expiresAt }),
    };
    const record = await this.taskRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateTaskInput): Promise<Task> {
    const record = await this.taskRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new NotFoundError('Task');
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.taskRepository.deleteOne(id);
  }
}

function mapToModel(entity: TaskEntity): Task {
  return {
    id: entity._id,
    userId: entity.userId,
    projectId: entity.projectId,
    name: entity.name,
    description: entity.description,
    status: entity.status as TaskStatus,
    dueDate: entity.dueDate,
  };
}
