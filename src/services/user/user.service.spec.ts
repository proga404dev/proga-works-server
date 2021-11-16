import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { PagedViewModel } from '../../utils/paged-view-model';
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
  const users = [{
    id: '560fecfb-45d2-4507-9cae-df4f6dd10a16',
    email: 'anakinskywalker@sw.com',
    firstname: 'Anakin',
    lastname: 'Skywalker',
    nickname: 'Ani',
    mobilePhoneNumber: '+00000000000',
  }, {
    id: '560fecfb-45d2-4507-9cae-df4f6dd10a16',
    email: 'obiwankenobi@sw.com',
    firstname: 'Obiwan',
    lastname: 'Kenobi',
    nickname: 'Obiwan',
    mobilePhoneNumber: '+11111111111',
  }]

  const db = {
    $transaction: jest.fn().mockImplementation(() =>
      Promise.resolve([users, users.length]),
    ),
    user: {
      create: jest.fn().mockReturnValue(userPayload),
      findMany: jest.fn().mockResolvedValue(users),
      count: jest.fn().mockImplementation(() =>
        Promise.resolve(users.length),
      ),
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

  it('should return a list of users without pagination', async () => {
    const result = await service.findAll(
      {
        enable: false,
        skip: undefined,
        take: undefined,
      },
      {},
    ) as User[];
    expect(result).toEqual(users);
    expect(result.length).toEqual(users.length);
  });
  it('should return a list of paginated users', async () => {
    const result = await service.findAll(
      {
        enable: true,
        skip: 0,
        take: 10,
      },
    ) as PagedViewModel<User>;

    expect(result).toEqual({
      items: [...users],
      total: users.length,
      skipped: 0,
      count: users.length,
      page: {
        current: 1, total: 1
      }
    });
  });
});
