import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @ApiOperation({ summary: 'Создать сертификат' })
  @Post()
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificateService.create();
  }

  @ApiOperation({ summary: 'Получить список всех сертификатов' })
  @Get()
  findAll() {
    return this.certificateService.findAll();
  }

  @ApiOperation({ summary: 'Найти сертификат по ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificateService.findOne(+id);
  }

  @ApiOperation({ summary: 'Удалить сертификат по ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificateService.remove(+id);
  }
}
