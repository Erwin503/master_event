import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEvent } from './entities/event.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { Certificate } from 'src/certificate/entities/certificate.entity';
import { CertificateService } from 'src/certificate/certificate.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEvent, Stage, Certificate]),
    FilesModule,
  ],
  controllers: [EventController],
  providers: [EventService, CertificateService],
})
export class EventModule {}
