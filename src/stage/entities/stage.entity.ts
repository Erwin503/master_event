import { UserEvent } from 'src/event/entities/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
@Entity('stages')
export class Stage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'bigint', nullable: false })
    event_id: number;

    @ManyToOne(() => UserEvent, (event) => event.stages)
    @JoinColumn({ name: 'event_id' })
    event: UserEvent;
}