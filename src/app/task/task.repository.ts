import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { TASK_COLLECTION } from '../../common/factory/task.factory';
import { TaskEntity, TaskEntityRead } from './models/task.entity';

@Injectable()
export class TaskRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(TASK_COLLECTION)
    private readonly collection: Collection<TaskEntityRead>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<TaskEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<TaskEntityRead>, options);
  }

  async find(filter: Filter<TaskEntityRead>, options?: FindOptions): Promise<TaskEntityRead[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: TaskEntity): Promise<TaskEntityRead> {
    const result = await this.collection.insertOne(entity as TaskEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<TaskEntity>): Promise<TaskEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<TaskEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<TaskEntityRead>);
  }
}
