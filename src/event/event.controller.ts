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
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  create(@Body(ValidationPipe) createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }


  @Put(':eventId/certificates/:certificateId')
  async attachCertificateToEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('certificateId', ParseIntPipe) certificateId: number,
  ) {
    return this.eventService.attachCertificateToEvent(eventId, certificateId);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.eventService.remove(+id);
  }
}
