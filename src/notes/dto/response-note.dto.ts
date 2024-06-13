import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

export class ResNoteDto extends PartialType(CreateNoteDto) {
  seen: boolean;
  id: number;
}
