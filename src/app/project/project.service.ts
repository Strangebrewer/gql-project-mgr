import { randomUUID } from 'crypto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { ProjectEntity } from './models/project.entity';
import {
  CreateProjectInput,
  Project,
  ProjectStatus,
  UpdateProjectInput,
} from './models/project.model';
import { ProjectRepository } from './project.repository';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
  ) {}

  async findById(id: string): Promise<Project> {
    const record = await this.projectRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Project');
    }
    return mapToModel(record);
  }

  async findByName(userId: string, name: string): Promise<Project | null> {
    const record = await this.projectRepository.findOne({ userId, name });
    return record ? mapToModel(record) : null;
  }

  async find(userId: string): Promise<Project[]> {
    const records = await this.projectRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateProjectInput, userId: string, options?: { isDemo?: boolean; expiresAt?: Date }): Promise<Project> {
    if (options?.isDemo) {
      const count = await this.projectRepository.count({ userId });
      if (count >= 4) throw new ForbiddenException('demo project limit reached');
    }
    const entity: ProjectEntity = {
      ...args,
      userId,
      _id: randomUUID(),
      ...(options?.expiresAt && { expiresAt: options.expiresAt }),
    };
    const record = await this.projectRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateProjectInput): Promise<Project> {
    const record = await this.projectRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new NotFoundError('Project');
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.projectRepository.deleteOne(id);
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
