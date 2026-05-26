import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { TaskEntity } from '../../app/task/models/task.entity';

export const TASK_COLLECTION = 'TASK_COLLECTION';

export const TaskCollectionFactory = {
  provide: TASK_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<TaskEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.task);
  },
  inject: [ConfigService, DB_CLIENT],
};
