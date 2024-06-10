import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEvent } from './entities/event.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { Certificate } from 'src/certificate/entities/certificate.entity';
import { CertificateService } from 'src/certificate/certificate.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(UserEvent)
    private eventRepository: Repository<UserEvent>,
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    private readonly certificateService: CertificateService
  ) { }

  async create(createEventDto: CreateEventDto): Promise<UserEvent> {
    const name = createEventDto.name;

    const existingEvent = await this.eventRepository.findOne({
      where: { name },
    });

    if (existingEvent) {
      throw new HttpException(
        'An event with this name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  async attachCertificateToEvent(eventId: number, certificateId: number): Promise<UserEvent> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const certificate = await this.certificateRepository.findOne({ where: { id: certificateId } });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    event.certificate = certificate;

    return this.eventRepository.save(event);
  }

  findAll(): Promise<UserEvent[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<UserEvent> {
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['certificate'] });

    if (!event) {
      throw new HttpException(
        'Event not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<UserEvent> {
    await this.eventRepository.update(id, updateEventDto);
    return this.eventRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    // Найти способ каскадного удаления
    await this.stageRepository.delete({ event_id: id });
    await this.eventRepository.delete(id);
  }
}
