import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../data-transfert-objects/user.dto';
import { UserService } from '../../services/user/user.service';
import { UserController } from './user.controller';
import { v4 as uuidv4 } from 'uuid'

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const userId = uuidv4();
  const userPayload: CreateUserDto = {
    firstname: 'Anakin',
    lastname: 'Skywalker',
    email: 'anakinskywalker@sw.com',
    nickname: 'Ani',
    mobilePhoneNumber: '+00000000000'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((payload: CreateUserDto) =>
                Promise.resolve({ id: userId, ...payload }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User', () => {
    it('should create a user', async () => {
      const payload: CreateUserDto = {
        firstname: userPayload.firstname,
        lastname: userPayload.lastname,
        email: userPayload.email,
        nickname: userPayload.nickname,
        mobilePhoneNumber: userPayload.mobilePhoneNumber,
      };
      await expect(controller.create(payload)).resolves.toEqual({
        id: userId,
        ...payload,
      });
    });
  });

});
