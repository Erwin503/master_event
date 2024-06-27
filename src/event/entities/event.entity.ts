import { Certificate } from 'src/certificate/entities/certificate.entity';
import { Stage } from 'src/stage/entities/stage.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EventStatus {
  ANNOUNCED = 'announced',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

@Entity('events')
export class UserEvent {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор мероприятия',
  })
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  @ApiProperty({
    example: 'Конференция разработчиков',
    description: 'Название мероприятия',
  })
  name: string;

  @Column({ type: 'int' })
  @ApiProperty({
    example: 10,
    description: 'Идентификатор владельца мероприятия',
  })
  owner: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.ANNOUNCED,
  })
  @ApiProperty({
    description: 'Статус мероприятия',
    enum: EventStatus,
    default: EventStatus.ANNOUNCED,
    enumName: 'EventStatus',
  })
  status: EventStatus;

  @Column({ type: 'varchar' })
  @ApiProperty({
    example: 'Мероприятие для обмена опытом между разработчиками',
    description: 'Описание мероприятия',
  })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({
    example: 'icon.png',
    description: 'Ссылка на иконку мероприятия',
    required: false,
  })
  icon: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({
    example: '2023-06-20T14:00:00.000Z',
    description: 'Время начала мероприятия',
  })
  start_event: Date;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    example: '2023-06-20T20:00:00.000Z',
    description: 'Время окончания мероприятия',
    required: false,
  })
  end_event: Date;

  @Column({ nullable: true })
  @ApiProperty({
    example: 5,
    description: 'Идентификатор сертификата',
    required: false,
  })
  certificate_id: number;

  @OneToMany(() => Stage, (stage) => stage.event)
  stages: Stage[];

  @OneToOne(() => Certificate, (certificate) => certificate.event)
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certificate;
}
