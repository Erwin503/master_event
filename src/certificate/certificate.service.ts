import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Repository } from 'typeorm';
import { UserEvent } from 'src/event/entities/event.entity';

@Injectable()
export class CertificateService {
  constructor(@InjectRepository(Certificate)
  private certificateRepository: Repository<Certificate>,
    @InjectRepository(UserEvent)
    private eventRepository: Repository<UserEvent>) { }

  async create(): Promise<Certificate> {
    const certificate = await this.certificateRepository.create();
    return this.certificateRepository.save(certificate);
  }

  async findAll() {
    return await this.certificateRepository.find();
  }

  async findOne(id: number) {
    const certificate = this.certificateRepository.findOne({ where: { id } })
    return certificate;
  }

  async remove(id: number) {
    const certificate = await this.certificateRepository.findOne({ where: { id } });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    const event = await this.eventRepository.findOne({ where: { certificate: { id: id } } });

    if (event) {
      event.certificate = null;
      await this.eventRepository.save(event);
    }

    // Удалить сертификат
    await this.certificateRepository.remove(certificate);
  }
}
