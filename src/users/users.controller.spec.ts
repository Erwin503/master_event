import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-role.enum';

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'password',
  role: UserRole.PARTICIPANT,
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      role: UserRole.PARTICIPANT,
    };
    const user = await controller.create(createUserDto);
    expect(user).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should find a user by ID', async () => {
    const user = await controller.findOne('1');
    expect(user).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should find all users', async () => {
    const users = await controller.findAll();
    expect(users).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
