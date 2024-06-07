import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const testUser = {
  id: 1,
  email: 'unit_test@example.com',
  password: 'test',
  phone: '1234567890',
  birth_date: new Date(),
  address: 'Test Address',
  role: 'PARTICIPANT',
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser as any);
      expect(await service.findOneByEmail(testUser.email)).toEqual(testUser);
    });
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashedPassword'));
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...testUser,
        password: 'hashedPassword',
      } as any);

      expect(await service.create(testUser as any)).toEqual({
        ...testUser,
        password: 'hashedPassword',
      });
    });

    it('should throw an error if user already exists', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser as any);

      await expect(service.create(testUser as any)).rejects.toThrow(
        new HttpException(
          'Пользователь с такой почтой уже существует',
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([testUser] as any);

      expect(await service.findAll()).toEqual([testUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser as any);

      expect(await service.findOne(testUser.id)).toEqual(testUser);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findOne(testUser.id)).rejects.toThrow(
        new HttpException(
          'Пользователя с таким id не существует',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a user with hashed password', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser as any);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('newHashedPassword'));
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...testUser,
        password: 'newHashedPassword',
      } as any);

      expect(
        await service.update(testUser.id, {
          ...testUser,
          password: 'newPassword',
        } as any),
      ).toEqual({
        ...testUser,
        password: 'newHashedPassword',
      });
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        service.update(testUser.id, testUser as any),
      ).rejects.toThrow(
        new HttpException(
          'Пользователя с таким id не существует',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(testUser as any);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(testUser as any);

      expect(await service.remove(testUser.id)).toEqual(testUser);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.remove(testUser.id)).rejects.toThrow(
        new HttpException(
          'Пользователя с таким id не существует',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
