import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('event')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiOperation({ summary: 'Создание мероприятия' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(ValidationPipe) createEventDto: CreateEventDto,
    @UploadedFile() image,
  ) {
    return this.eventService.create(createEventDto, image);
  }

  @ApiOperation({ summary: 'Присоединение сертификата к мероприятию' })
  @Put(':eventId/certificates/:certificateId')
  async attachCertificateToEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('certificateId', ParseIntPipe) certificateId: number,
  ) {
    return this.eventService.attachCertificateToEvent(eventId, certificateId);
  }

  @ApiOperation({ summary: 'Получение списка всех мероприятий' })
  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @ApiOperation({ summary: 'Получение мероприятия по ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.eventService.findOne(+id);
  }

  @ApiOperation({ summary: 'Обновление мероприятия' })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() image,
  ) {
    return this.eventService.update(id, updateEventDto, image);
  }

  @ApiOperation({ summary: 'Удаление мероприятия' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.eventService.remove(+id);
  }
}
