import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from 'src/entities/note.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ResNoteDto } from './dto/response-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private readonly usersService: UsersService,
  ) {}
  toRes(note: Note): ResNoteDto {
    const { owner, ...result } = note;
    return { ...result, userId: owner.id };
  }
  async create(createNoteDto: CreateNoteDto): Promise<ResNoteDto> {
    const user = await this.usersService.findOne(createNoteDto.userId);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }
    if (!createNoteDto.text) {
      throw new BadRequestException({
        message: 'There should be a text',
      });
    }
    const note = await this.notesRepository.save({
      text: createNoteDto.text,
      owner: user,
      seen: false,
    });
    return this.toRes(note);
  }

  async findAll(): Promise<ResNoteDto[]> {
    const notes = await this.notesRepository.find({
      relations: ['owner'],
    });
    return notes.map((note) => this.toRes(note));
  }

  async findOne(id: number): Promise<ResNoteDto> {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!note) {
      throw new NotFoundException({
        message: 'Note not found',
      });
    }
    return this.toRes(note);
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<ResNoteDto> {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!note) {
      throw new NotFoundException({
        message: 'Note not found',
      });
    }
    if (updateNoteDto.owner) {
      const user = await this.usersService.findOne(updateNoteDto.owner);
      Object.assign(note, { ...updateNoteDto, owner: user });
    } else {
      Object.assign(note, { ...note, seen: updateNoteDto.seen });
    }
    return this.toRes(await this.notesRepository.save(note));
  }

  async remove(id: number): Promise<ResNoteDto> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException({
        message: 'Note not found',
      });
    }
    return this.toRes(await this.notesRepository.remove(note));
  }
  async getByUser(userId: number): Promise<ResNoteDto[]> {
    const user = await this.usersService.findOneWithParam(userId, 'notes');
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }
    return user.notes.map((note) => {
      return { ...note, userId: user.id };
    });
  }
}
