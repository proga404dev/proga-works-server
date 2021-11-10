import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const userPayload: Prisma.UserCreateInput = {
    email: 'anakinskywalker@sw.com',
    firstname: 'Anakin',
    lastname: 'Skywalker',
    nickname: 'Ani',
    mobilePhoneNumber: '+00000000000',
  };

  const db = {
    user: {
      create: jest.fn().mockReturnValue(userPayload)
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create user', () => {
    it('should create a user', () => {
      const user = userPayload;
      expect(
        service.create(
          {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            nickname: user.nickname,
            mobilePhoneNumber: user.mobilePhoneNumber
          },
        ),
      ).resolves.toEqual(userPayload);
    });
  });
});
