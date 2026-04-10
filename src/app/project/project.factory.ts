import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { ProjectEntity } from './project.entity';

export const PROJECT_COLLECTION = 'PROJECT_COLLECTION';

export const ProjectCollectionFactory = {
  provide: PROJECT_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<ProjectEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.project);
  },
  inject: [ConfigService, DB_CLIENT],
};
