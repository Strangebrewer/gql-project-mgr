import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';
import { SharedModule } from './shared/shared.module';
import { ProjectModule } from './app/project/project.module';
import { TaskModule } from './app/task/task.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TraceInterceptor } from './common/interceptors/trace.interceptor';
import { PubSubModule } from './app/pubsub/pubsub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        level: 'info',
        stream: {
          write(msg: string) {
            const entry = JSON.parse(msg);
            const internal = [
              'InstanceLoader',
              'NestFactory',
              'RouterExplorer',
              'RoutesResolver',
              'NestApplication',
              'GraphQLModule',
              'AppModule',
            ];
            if (internal.includes(entry.context)) return;
            process.stdout.write(msg);
          },
        },
      },
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
    }),
    SharedModule,
    ProjectModule,
    TaskModule,
    PubSubModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: TraceInterceptor }],
})
export class AppModule {}
