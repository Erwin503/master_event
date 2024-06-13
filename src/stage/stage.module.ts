import { Module } from '@nestjs/common';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from './entities/stage.entity';
import { UserEvent } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stage, UserEvent])],
  controllers: [StageController],
  providers: [StageService],
})
export class StageModule { }
