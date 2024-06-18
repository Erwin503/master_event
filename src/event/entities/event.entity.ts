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

export enum EventStatus {
  ANNOUNCED = 'announced',
  ACTIVE = 'active',
  FINISHED = 'finished',
}

@Entity('events')
export class UserEvent {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 150, unique: true })
  name: string;

  @Column({ type: 'int' })
  owner: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.ANNOUNCED,
  })
  status: EventStatus;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @Column({ type: 'timestamp' })
  start_event: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_event: Date;

  @Column({ nullable: true })
  certificate_id: number;

  @OneToMany(() => Stage, (stage) => stage.event)
  stages: Stage[];

  @OneToOne(() => Certificate, (certificate) => certificate.event)
  @JoinColumn({ name: 'certificate_id' })
  certificate: Certificate;
}
