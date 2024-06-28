import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum InstitutionType {
  LYCEUM = 'лицей',
  SCHOOL = 'школа',
  GYMNASIUM = 'гимназия',
  UNIVERSITY = 'университет',
  COLLEGE = 'колледж',
  OTHER = 'другое',
}

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Уникальный идентификатор организации',
    example: 1,
  })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({
    description: 'Название организации',
    maxLength: 255,
    example: 'Школа №1',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: InstitutionType,
    default: InstitutionType.OTHER,
  })
  @ApiProperty({
    description: 'Тип предприятия',
    enum: InstitutionType,
    default: InstitutionType.OTHER,
    enumName: 'InstitutionType',
    example: InstitutionType.SCHOOL,
  })
  type: InstitutionType;

  @Column({ length: 100, nullable: true })
  @ApiProperty({
    description: 'Email организации',
    maxLength: 100,
    required: false,
    example: 'example@example.com',
  })
  email: string;

  @Column({ length: 255 })
  @ApiProperty({
    description: 'Регион',
    maxLength: 255,
    example: 'Республика Крым',
  })
  region: string;

  @Column({ length: 255 })
  @ApiProperty({
    description: 'Район',
    maxLength: 255,
    example: 'Симферопольский район',
  })
  district: string;
}
