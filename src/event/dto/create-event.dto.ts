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

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  owner: number;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus = EventStatus.ANNOUNCED;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  @IsImagePath()
  icon?: string;

  @IsNumber()
  @IsOptional()
  cert_id?: number;
}
