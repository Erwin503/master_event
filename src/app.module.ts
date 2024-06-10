import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { EventsModule } from './events/events.module';
// import { CertificatesModule } from './certificates/certificates.module';
// import { StagesModule } from './stages/stages.module';
// import { TeamsModule } from './teams/teams.module';
// import { OrganizationsModule } from './organizations/organizations.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { EventTeamsModule } from './event-teams/event-teams.module';
// import { EventUsersModule } from './event-users/event-users.module';
// import { UserTeamsModule } from './user-teams/user-teams.module';
// import { EventOrgModule } from './event-org/event-org.module';
// import { NoteTextsModule } from './note-texts/note-texts.module';
import { EventModule } from './event/event.module';
import { StageModule } from './stage/stage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    // AuthModule,
    UsersModule,
    EventModule,
    StageModule,
    // EventsModule,
    // CertificatesModule,
    // StagesModule,
    // TeamsModule,
    // OrganizationsModule,
    // NotificationsModule,
    // EventTeamsModule,
    // EventUsersModule,
    // UserTeamsModule,
    // EventOrgModule,
    // NoteTextsModule,
  ],
})
export class AppModule {}
