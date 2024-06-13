import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const user = await this.findOneByEmail(CreateUserDto.email);

    if (user) {
      throw new HttpException(
        'Пользователь с такой почтой уже существует',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(CreateUserDto.password, 10);
    CreateUserDto.password = hashedPassword;

    return await this.usersRepository.save(CreateUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException(
        'Пользователя с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
  async findOneWithParam(
    id: number,
    param: string = null,
  ): Promise<User | undefined> {
    if (!param) {
      throw new BadRequestException({
        message: 'Param required',
      });
    }
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: [param],
    });
    if (!user) {
      throw new HttpException(
        'Пользователя с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: number, UpdateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        'Пользователя с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    if (UpdateUserDto.password) {
      UpdateUserDto.password = await bcrypt.hash(UpdateUserDto.password, 10);
    }
    Object.assign(user, UpdateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        'Пользователя с таким id не существует',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.usersRepository.remove(user);
  }
}
