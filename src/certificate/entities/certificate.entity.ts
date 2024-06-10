import { UserEvent } from 'src/event/entities/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity('certificates')
export class Certificate {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @OneToOne(() => UserEvent, (event) => event.certificate)
    event: UserEvent;
}