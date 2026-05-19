import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Db, MongoClient } from 'mongodb';

export const DB_CLIENT = 'DB_CLIENT';

@Module({
  providers: [
    {
      provide: DB_CLIENT,
      useFactory: async (configService: ConfigService): Promise<Db> => {
        const { uri, username, password, cluster, name, collections } = configService.get<DatabaseConfig>('database');
        const connectionUri = uri ?? `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${name}?retryWrites=true`;
        const client = await MongoClient.connect(connectionUri);
        const db = client.db(name);
        await Promise.all([
          db.collection(collections.project).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true }),
          db.collection(collections.task).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true }),
        ]);
        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_CLIENT],
})
export class MongoModule {}
