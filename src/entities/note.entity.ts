import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  text: string;

  @Column()
  seen: boolean;

  @ManyToOne(() => User, (user) => user.notes)
  owner: User;
}
