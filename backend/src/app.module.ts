import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Imagetextgps from './entities/imagetextgps.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      database: 'SurveybyCam',
      entities: [Imagetextgps],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Imagetextgps])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
