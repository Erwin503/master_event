import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsEnum, IsOptional } from 'class-validator';
import { InstitutionType } from '../entities/organization.entity';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Название организации',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Тип предприятия',
    enum: InstitutionType,
    default: InstitutionType.OTHER,
    enumName: 'InstitutionType',
  })
  @IsEnum(InstitutionType)
  type: InstitutionType;

  @ApiProperty({
    description: 'Email организации',
    maxLength: 100,
    required: false,
  })
  @IsEmail()
  @Length(1, 100)
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Регион',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  region: string;

  @ApiProperty({
    description: 'Район',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  district: string;
}
