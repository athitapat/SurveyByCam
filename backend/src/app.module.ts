import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Imagetextgps from './entities/imagetextgps.entity';
import Boxingpath from './entities/boxingpath.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      database: 'SurveybyCam',
      entities: [Imagetextgps, Boxingpath],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Imagetextgps, Boxingpath])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
