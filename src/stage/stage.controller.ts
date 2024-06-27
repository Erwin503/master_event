import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { StageService } from './stage.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('stage')
@Controller('events/:event_id/stages')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @ApiOperation({ summary: 'Создание этапа мероприятия' })
  @Post()
  create(
    @Param('event_id', ParseIntPipe) event_id: number,
    @Body(ValidationPipe) createStageDto: CreateStageDto,
  ) {
    return this.stageService.create(createStageDto, event_id);
  }

  @ApiOperation({ summary: 'Получение всех этапов мероприятия' })
  @Get()
  findAll(@Param('event_id', ParseIntPipe) event_id: number) {
    return this.stageService.findAll(event_id);
  }

  @ApiOperation({ summary: 'Получение информации об одном этапе мероприятия' })
  @Get(':stage_id')
  findOne(@Param('stage_id', ParseIntPipe) stage_id: string) {
    return this.stageService.findOne(+stage_id);
  }

  @ApiOperation({ summary: 'Обновление этапа мероприятия' })
  @Patch(':stage_id')
  update(
    @Param('stage_id') stage_id: number,
    @Body() updateStageDto: UpdateStageDto,
  ) {
    return this.stageService.update(stage_id, updateStageDto);
  }

  @ApiOperation({ summary: 'Удаление этапа мероприятия' })
  @Delete(':stage_id')
  remove(@Param('stage_id') stage_id: number) {
    return this.stageService.remove(stage_id);
  }
}
