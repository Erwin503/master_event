// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserRole } from '../users/user-role.enum';
// import { Event } from '.../events/event.entity';
// import { Team } from '.../teams/team.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PARTICIPANT,
  })
  role: UserRole;

  //   @OneToMany(() => Event, (event) => event.owner)
  //   events: Event[];

  //   @OneToMany(() => Team, (team) => team.manager)
  //   teams: Team[];
}
