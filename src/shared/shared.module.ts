import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from '../config/app';
import { LibsModule } from './libs/libs.module';
import { MongoModule } from './mongo/mongo.module';
import { TracerModule } from './tracer/tracer.module';

@Module({
  imports: [
    MongoModule,
    LibsModule,
    TracerModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        publicKey: configService.get<AppConfig>('app').jwtPublicKey,
        verifyOptions: { algorithms: ['RS256'] },
      }),
    }),
  ],
  exports: [MongoModule, LibsModule, JwtModule, TracerModule],
})
export class SharedModule {}
