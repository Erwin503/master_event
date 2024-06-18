import { Stage } from 'src/stage/entities/stage.entity';
import { UserEvent } from '../entities/event.entity';

export class EventDetailedDto {
  event: UserEvent;
  currentStage: Stage;
  stageCount: number;
}
