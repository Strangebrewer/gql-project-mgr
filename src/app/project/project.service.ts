import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { DeleteResult } from '../../common/models/common.model';
import { ProjectEntity } from './models/project.entity';
import { CreateProjectArgs, Project, ProjectStatus, UpdateProjectArgs } from './models/project.model';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<Project> {
    const record = await this.projectRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Project not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async find(userId: string): Promise<Project[]> {
    const records = await this.projectRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateProjectArgs, userId: string): Promise<Project> {
    const entity: ProjectEntity = {
      ...args,
      userId,
      id: this.idGenerator.generate('PRJ'),
    };
    const record = await this.projectRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateProjectArgs): Promise<Project> {
    const record = await this.projectRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Project not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.projectRepository.deleteOne(id);
  }
}

function mapToModel(entity: ProjectEntity): Project {
  return {
    id: entity.id,
    userId: entity.userId,
    name: entity.name,
    description: entity.description,
    status: entity.status as ProjectStatus,
    dueDate: entity.dueDate,
  };
}
