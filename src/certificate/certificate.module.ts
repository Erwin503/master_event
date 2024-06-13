import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { Certificate } from './entities/certificate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEvent } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, UserEvent])],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule { }
