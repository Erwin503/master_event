import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
export class CreateStageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  start_stage: string;

  @IsNotEmpty()
  @IsDateString()
  end_stage: string;

  @IsNumber()
  @IsOptional()
  event_id?: number;
}
