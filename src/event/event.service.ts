import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventStatus, UserEvent } from './entities/event.entity';
import { STATUS_CODES } from 'http';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(UserEvent)
    private eventRepository: Repository<UserEvent>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<UserEvent> {
    const name = createEventDto.name;

    const existingEvent = await this.eventRepository.findOne({
      where: { name },
    });

    if (existingEvent) {
      throw new HttpException(
        'Мероприятие с таким названием уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  findAll(): Promise<UserEvent[]> {
    return this.eventRepository.find();
  }

  findOne(id: number): Promise<UserEvent> {
    return this.eventRepository.findOne({ where: { id } });
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<UserEvent> {
    await this.eventRepository.update(id, updateEventDto);
    return this.eventRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
