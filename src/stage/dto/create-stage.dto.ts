import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
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
  @IsNotEmpty()
  event_id: number;
}
