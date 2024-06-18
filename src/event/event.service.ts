import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEvent } from './entities/event.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import { Certificate } from 'src/certificate/entities/certificate.entity';
import { FilesService } from 'src/files/files.service';
import { EventDetailedDto } from './dto/event-deatail.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(UserEvent)
    private eventRepository: Repository<UserEvent>,
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    private fileService: FilesService,
  ) {}

  private findCurrentStage(stages: Stage[]) {
    const now = new Date();

    for (const stage of stages) {
      const startStageDate = new Date(stage.start_stage);
      const endStageDate = new Date(stage.end_stage);

      if (startStageDate <= now && endStageDate >= now) {
        return stage;
      }
    }

    return null;
  }
  async create(createEventDto: CreateEventDto, image: any): Promise<UserEvent> {
    const name = createEventDto.name;
    const file = await this.fileService.createFile(image);

    const existingEvent = await this.eventRepository.findOne({
      where: { name },
    });
    if (existingEvent) {
      throw new HttpException(
        'An event with this name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      icon: file,
    });
    return this.eventRepository.save(event);
  }

  async attachCertificateToEvent(
    eventId: number,
    certificateId: number,
  ): Promise<UserEvent> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const certificate = await this.certificateRepository.findOne({
      where: { id: certificateId },
    });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    event.certificate = certificate;

    return this.eventRepository.save(event);
  }

  async findAll(): Promise<EventDetailedDto[]> {
    const events = await this.eventRepository.find({
      relations: ['certificate', 'stages'],
    });

    let detailEvents: EventDetailedDto[] = [];
    for (let i = 0; i < events.length; i++) {
      const event: EventDetailedDto = {
        event: events[i],
        currentStage: this.findCurrentStage(events[i].stages),
        stageCount: events[i].stages.length,
      };
      detailEvents.push(event);
      events[i].stages = null; // убирает информацию обо всех этапах
    }
    return detailEvents;
  }

  async findOne(id: number): Promise<EventDetailedDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['certificate', 'stages'],
    });

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
    }

    const stages = event.stages;
    const currentStage = this.findCurrentStage(stages);

    return { event, currentStage, stageCount: stages.length };
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    image: any,
  ): Promise<UserEvent> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
    }

    if (image) {
      const file = await this.fileService.createFile(image);
      updateEventDto = {
        ...updateEventDto,
        icon: file,
      };
    }

    await this.eventRepository.update(id, updateEventDto);
    return this.eventRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    // Найти способ каскадного удаления
    await this.stageRepository.delete({ event_id: id });
    await this.eventRepository.delete(id);
  }
}
