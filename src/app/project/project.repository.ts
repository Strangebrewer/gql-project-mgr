import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { PROJECT_COLLECTION } from '../../common/factory/project.factory';
import { ProjectEntity, ProjectEntityRead } from './models/project.entity';

@Injectable()
export class ProjectRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(PROJECT_COLLECTION)
    private readonly collection: Collection<ProjectEntityRead>,
  ) {}

  async findOne(filter: Filter<ProjectEntityRead>, options?: FindOptions): Promise<ProjectEntityRead> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<ProjectEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<ProjectEntityRead>, options);
  }

  async find(filter: Filter<ProjectEntityRead>, options?: FindOptions): Promise<ProjectEntityRead[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: ProjectEntity): Promise<ProjectEntityRead> {
    const result = await this.collection.insertOne(entity as ProjectEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<ProjectEntity>): Promise<ProjectEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<ProjectEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<ProjectEntityRead>);
  }
}
