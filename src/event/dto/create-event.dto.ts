import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';
import { IsImagePath } from 'src/decorators/is_image_path.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Лимон 2024', description: 'Название мероприятия' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 21,
    description:
      'ID создателя мероприятия (создателем может быть только user с ролью ADMIN)',
  })
  @IsNumber()
  @IsNotEmpty()
  owner: number;

  @ApiPropertyOptional({
    example: 'annonced',
    description:
      'Статус мероприяти описывает состояние мероприятия. Возможные статусы: announced, active, finished.',
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus = EventStatus.ANNOUNCED;

  @ApiProperty({
    example: 'Лимон 2024 - это площадка, где каждый может проявить себя',
    description:
      'В этом поле указывается информация о мероприятии, его условиях, этапах и другой необходимой информации.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiPropertyOptional({
    example: 'log_limon.png',
    description: 'В этом поле храниться название изображения мероприятия.',
  })
  @IsString()
  @IsOptional()
  // Декоратор проверяет ссылку на соответсвие формату image/eventBackground/name.jpg
  // @IsImagePath()
  icon?: string;

  @ApiPropertyOptional({
    example: 34,
    description:
      'В этом поле храниться ID шаблона сертификата связанного с мероприятием.',
  })
  @IsNumber()
  @IsOptional()
  cert_id?: number;
}
