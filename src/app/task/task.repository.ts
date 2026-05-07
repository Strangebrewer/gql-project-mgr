import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { TASK_COLLECTION } from '../../common/factory/task.factory';
import { TaskEntity } from './models/task.entity';

@Injectable()
export class TaskRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(TASK_COLLECTION)
    private readonly collection: Collection<TaskEntity>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<TaskEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<TaskEntity>, options);
  }

  async find(filter: Filter<TaskEntity>, options?: FindOptions): Promise<TaskEntity[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: TaskEntity): Promise<TaskEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<TaskEntity>): Promise<TaskEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<TaskEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<TaskEntity>);
  }
}
