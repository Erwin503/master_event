import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { Repository } from 'typeorm';
import { Stage } from './entities/stage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEvent } from 'src/event/entities/event.entity';

@Injectable()
export class StageService {
  constructor(@InjectRepository(Stage) private stageRepository: Repository<Stage>,
    @InjectRepository(UserEvent) private eventRepository: Repository<UserEvent>) { }

  async create(createStageDto: CreateStageDto) {
    const stage = this.stageRepository.create(createStageDto);
    const event = await this.eventRepository.findOne({ where: { id: createStageDto.event_id } });
    if (!event) {
      throw new HttpException(
        'Event not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.stageRepository.save(stage);
  }

  findAll() {
    return this.stageRepository.find();
  }

  async findOne(id: number): Promise<Stage> {
    const stage = await this.stageRepository.findOne({ where: { id } });

    if (!stage) {
      throw new HttpException(
        'Stage not found',
        HttpStatus.BAD_REQUEST,
      );
    }
    return stage;
  }

  async update(id: number, updateStageDto: UpdateStageDto) {
    await this.stageRepository.update(id, updateStageDto);
    return this.stageRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.stageRepository.delete(id);
    return `This action removes a #${id} stage`;
  }
}
