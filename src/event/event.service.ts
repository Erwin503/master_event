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

  /**
   * Находит текущий этап из списка этапов, основываясь на текущей дате.
   *
   * @param этапы - Массив объектов этапов, каждый из которых содержит поля start_stage и end_stage с датами начала и окончания этапа.
   * @returns Текущий этап, если он существует; в противном случае возвращает null.
   */
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

  /**
   * Проверяет, что дата начала раньше даты окончания.
   *
   * @param начало - Строка с датой начала.
   * @param конец - Строка с датой окончания.
   * @returns true, если дата начала раньше даты окончания или если дата окончания не указана; false в противном случае.
   */
  private checkTime(start: string, end: string): boolean {
    if (!end) {
      return true;
    }
    return new Date(start) < new Date(end);
  }

  /**
   * Создает новое событие на основе переданных данных и изображения.
   *
   * @param createEventDto - Объект, содержащий данные для создания события, включая название, даты начала и окончания.
   * @param image - Изображение, которое будет использовано в качестве иконки события.
   * @returns Созданное событие в формате UserEvent.
   */
  async create(createEventDto: CreateEventDto, image: any): Promise<UserEvent> {
    const file = await this.fileService.createFile(image);

    if (!this.checkTime(createEventDto.start_event, createEventDto.end_event)) {
      throw new HttpException(
        'Invalid start and end dates provided, start date cannot be later than end date',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingEvent = await this.eventRepository.findOne({
      where: { name: createEventDto.name },
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
  /**
   * Прикрепляет сертификат к событию по их идентификаторам.
   *
   * @param eventId - Идентификатор события, к которому будет прикреплен сертификат.
   * @param certificateId - Идентификатор сертификата, который будет прикреплен к событию.
   * @returns Обновленное событие с прикрепленным сертификатом.
   */
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

  /**
   * Получает все мероприятия с дополнительной информацией о текущем этапе и количестве этапов.
   *
   * @returns Массив объектов EventDetailedDto, содержащих детальную информацию о каждом мероприятии.
   */
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
      events[i].stages = null;
    }
    return detailEvents;
  }

  /**
   * Получает мероприятие по его идентификатору с дополнительной информацией о текущем этапе и количестве этапов.
   *
   * @param id - Идентификатор мероприятия.
   * @returns Объект EventDetailedDto, содержащий детальную информацию о мероприятии.
   */
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

  /**
   * Обновляет информацию о мероприятии по его идентификатору.
   *
   * @param id - Идентификатор мероприятия.
   * @param updateEventDto - Объект, содержащий данные для обновления мероприятия.
   * @param image - Изображение, которое будет использовано в качестве иконки мероприятия.
   * @returns Обновленное мероприятие.
   */
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

    if (
      updateEventDto.hasOwnProperty('start_event') ||
      updateEventDto.hasOwnProperty('end_event')
    ) {
      const start_event = updateEventDto.hasOwnProperty('start_event')
        ? updateEventDto.start_event
        : event.start_event;
      const end_event = updateEventDto.hasOwnProperty('end_event')
        ? updateEventDto.end_event
        : event.end_event;

      if (!this.checkTime(String(start_event), String(end_event))) {
        throw new HttpException(
          'Invalid start and end dates provided, start date cannot be later than end date',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.eventRepository.update(id, updateEventDto);
    return this.eventRepository.findOne({ where: { id } });
  }

  /**
   * Удаляет мероприятие по его идентификатору.
   *
   * @param id - Идентификатор мероприятия.
   * @returns void
   */
  async remove(id: number): Promise<void> {
    // TO DO: Найти способ каскадного удаления
    await this.stageRepository.delete({ event_id: id });
    const result = await this.eventRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}
