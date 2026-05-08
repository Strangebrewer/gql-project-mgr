import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { TaskEntity } from './models/task.entity';
import { CreateTaskArgs, Task, TaskStatus, UpdateTaskArgs } from './models/task.model';
import { TaskRepository } from './task.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from 'src/shared/tracer/tracer.module';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    @Inject(TRACER_CLIENT) private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<Task> {
    const start = new Date();
    const op = `find_task by id: ${id}`;
    const record = await this.taskRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Task not found', start, end);
      throw new NotFoundError('Task');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async findByProject(projectId: string, traceId?: string): Promise<Task[]> {
    const start = new Date();
    const op = `find_tasks by project: ${projectId}`;
    const records = await this.taskRepository.find({ projectId });
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(args: CreateTaskArgs, userId: string, traceId?: string): Promise<Task> {
    const start = new Date();
    const op = 'create_task';
    const entity: TaskEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.taskRepository.create(entity);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateTaskArgs, traceId?: string): Promise<Task> {
    const start = new Date();
    const op = `update_task by id: ${id}`;
    const record = await this.taskRepository.findOneAndUpdate(id, args);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Task not found', start, end);
      throw new NotFoundError('Task');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_task by id: ${id}`;
    const result = await this.taskRepository.deleteOne(id);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return result;
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
