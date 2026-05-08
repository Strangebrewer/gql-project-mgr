import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { ProjectEntity } from './models/project.entity';
import {
  CreateProjectArgs,
  Project,
  ProjectStatus,
  UpdateProjectArgs,
} from './models/project.model';
import { ProjectRepository } from './project.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from 'src/shared/tracer/tracer.module';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    @Inject(TRACER_CLIENT) private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<Project> {
    const start = new Date();
    const op = `find_project by id: ${id}`;
    const record = await this.projectRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Project not found', start, end);
      throw new NotFoundError('Project');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async find(userId: string, traceId?: string): Promise<Project[]> {
    const start = new Date();
    const op = 'find_projects';
    const records = await this.projectRepository.find({ userId });
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(args: CreateProjectArgs, userId: string, traceId?: string): Promise<Project> {
    const start = new Date();
    const op = 'create_project';
    const entity: ProjectEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.projectRepository.create(entity);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateProjectArgs, traceId?: string): Promise<Project> {
    const start = new Date();
    const op = `update_project by id: ${id}`;
    const record = await this.projectRepository.findOneAndUpdate(id, args);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Project not found', start, end);
      throw new NotFoundError('Project');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_project by id: ${id}`;
    const result = await this.projectRepository.deleteOne(id);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return result;
  }
}

function mapToModel(entity: ProjectEntity): Project {
  return {
    id: entity._id,
    userId: entity.userId,
    name: entity.name,
    description: entity.description,
    status: entity.status as ProjectStatus,
    dueDate: entity.dueDate,
  };
}
