import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { PROJECT_COLLECTION } from '../../common/factory/project.factory';
import { ProjectEntity } from './models/project.entity';

@Injectable()
export class ProjectRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(PROJECT_COLLECTION)
    private readonly collection: Collection<ProjectEntity>,
  ) {}

  async findOne(filter: Filter<ProjectEntity>, options?: FindOptions): Promise<ProjectEntity> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<ProjectEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<ProjectEntity>, options);
  }

  async find(filter: Filter<ProjectEntity>, options?: FindOptions): Promise<ProjectEntity[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: ProjectEntity): Promise<ProjectEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<ProjectEntity>): Promise<ProjectEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<ProjectEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<ProjectEntity>);
  }
}
