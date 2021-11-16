import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../data-transfert-objects/user.dto';
import { UserService } from '../../services/user/user.service';
import { UserController } from './user.controller';
import { v4 as uuidv4 } from 'uuid'
import { User } from '.prisma/client';
import { PagedViewModel } from '../../utils/paged-view-model';
import { IUserQueryParams } from '../../interfaces/user-query-params.interface';
import { IPagination } from '../../interfaces/pagination.interface';
import { Prisma } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const uuid0 = uuidv4()
  const uuid1 = uuidv4()


  const mocks: { userId: string; userCreatePayload: CreateUserDto; users: Partial<User>[] } = {
    userId: uuidv4(),
    userCreatePayload: {
      firstname: 'Anakin',
      lastname: 'Skywalker',
      email: 'anakinskywalker@sw.com',
      nickname: 'Ani',
      mobilePhoneNumber: '+00000000000'
    },
    users: [{
      id: uuid0,
      firstname: 'Anakin',
      lastname: 'Skywalker',
      email: 'anakinskywalker@sw.com',
      nickname: 'Ani',
      mobilePhoneNumber: '+00000000000',
    }, {
      id: uuid1,
      firstname: 'Obiwan',
      lastname: 'Kenobi',
      email: 'obinwankenobi@sw.com',
      nickname: 'Obi',
      mobilePhoneNumber: '+11111111111',
    }]
  }


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockImplementation((payload: CreateUserDto) =>
              Promise.resolve({ id: mocks.userId, ...mocks.userCreatePayload }),
            ),
            findAll: jest.fn().mockImplementation((pagination: IPagination,
              filters?: { email?: { contains: string }, nickname?: { contains: string } },
              orderBy?: [{ email?: 'asc' | 'desc' }]
            ) => {
              if (!pagination.enable) {
                if (filters) {
                  if (filters.nickname) {

                    const items = mocks.users.filter((u) => u.nickname.includes(filters.nickname.contains as string))
                    return Promise.resolve(items as User[]);
                  }
                }
                if (orderBy) {
                  if (orderBy[0] && orderBy[0].email) {
                    const items = mocks.users.sort(function (a, b) {
                      if (a.email < b.email) { return -1; }
                      if (a.email > b.email) { return 1; }
                      return 0;
                    })
                    return Promise.resolve(items as User[]);
                  }
                }
                return Promise.resolve(mocks.users);
              } else {
                if (filters) {
                  if (filters.email) {
                    const items = mocks.users.filter((u) => u.email.includes(filters.email.contains as string))


                    return Promise.resolve({
                      items: items as User[],
                      total: items.length,
                      skipped: 0,
                      count: items.length,
                      page: {
                        current: 1, total: 1
                      }
                    } as PagedViewModel<User>);
                  }
                  if (orderBy) {

                    if (orderBy[0] && orderBy[0].email) {
                      const items = mocks.users.sort((a, b) => {
                        if (a.email > b.email) {
                          return -1;
                        }
                        if (a.email < b.email) {
                          return 1;
                        }
                        return 0;
                      });

                      return Promise.resolve({
                        items: items as User[],
                        total: items.length,
                        skipped: 0,
                        count: items.length,
                        page: {
                          current: 1, total: 1
                        }
                      } as PagedViewModel<User>);
                    }
                  }
                }
                return Promise.resolve({
                  items: [...mocks.users],
                  total: mocks.users.length,
                  skipped: 0,
                  count: mocks.users.length,
                  page: {
                    current: 1, total: 1
                  }
                });
              }
            }
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

  it('should create a user', async () => {
    const payload: CreateUserDto = {
      firstname: mocks.userCreatePayload.firstname,
      lastname: mocks.userCreatePayload.lastname,
      email: mocks.userCreatePayload.email,
      nickname: mocks.userCreatePayload.nickname,
      mobilePhoneNumber: mocks.userCreatePayload.mobilePhoneNumber,
    };
    await expect(controller.create(payload)).resolves.toEqual({
      id: mocks.userId,
      ...mocks.userCreatePayload,
    });
  });
  it('should return a list of users without pagination', async () => {
    const result = await controller.findAll({ pagination: '0' }) as User[];
    expect(result).toEqual(mocks.users);
    expect(result.length).toBe(mocks.users.length);
  });
  it('should return a list of paginated users', async () => {
    const result = await controller.findAll({ pagination: '1' }) as PagedViewModel<User>;
    expect(result).toEqual({
      items: [...mocks.users],
      total: mocks.users.length,
      skipped: 0,
      count: 2,
      page: {
        current: 1, total: 1
      }
    });
  });

  it('should return a filtered list of users without pagination', async () => {
    const result = await controller.findAll({ pagination: '0', nickname: 'Obi' }) as PagedViewModel<User>;
    expect(result).toEqual([mocks.users[1]]);
  });

  it('should return a filtered list of paginated users', async () => {
    const result = await controller.findAll({ pagination: '1', email: 'anakin' }) as PagedViewModel<User>;
    expect(result).toEqual({
      items: [mocks.users[0]],
      total: 1,
      skipped: 0,
      count: 1,
      page: {
        current: 1, total: 1
      }
    });
  });

  it('should return a list of paginated users sorted by email', async () => {
    const result = await controller.findAll({ pagination: '1', term: 'desc', orderBy: 'email' }) as PagedViewModel<User>;

    expect(result).toEqual({
      items: mocks.users.reverse(),
      total: 2,
      skipped: 0,
      count: 2,
      page: {
        current: 1, total: 1
      }
    });
  });

  it('should return a list of users sorted by email without pagination', async () => {
    const result = await controller.findAll({ pagination: '0', term: 'desc', orderBy: 'email' }) as PagedViewModel<User>;

    expect(result).toEqual(mocks.users.reverse());
  });

});


