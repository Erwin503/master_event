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

@Controller('events/:event_id/stages')
export class StageController {
  constructor(private readonly stageService: StageService) {}

  @Post()
  create(
    @Param('event_id', ParseIntPipe) event_id: number,
    @Body(ValidationPipe) createStageDto: CreateStageDto,
  ) {
    return this.stageService.create(createStageDto, event_id);
  }

  @Get()
  findAll(@Param('event_id', ParseIntPipe) event_id: number) {
    return this.stageService.findAll(event_id);
  }

  @Get(':stage_id')
  findOne(@Param('stage_id', ParseIntPipe) stage_id: string) {
    return this.stageService.findOne(+stage_id);
  }

  @Patch(':stage_id')
  update(
    @Param('stage_id') stage_id: number,
    @Body() updateStageDto: UpdateStageDto,
  ) {
    return this.stageService.update(stage_id, updateStageDto);
  }

  @Delete(':stage_id')
  remove(@Param('stage_id') stage_id: number) {
    return this.stageService.remove(stage_id);
  }
}
