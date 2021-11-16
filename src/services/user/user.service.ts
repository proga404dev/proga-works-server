import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { IPagination } from '../../interfaces/pagination.interface';
import { Paged } from '../../utils/paged';
import { PagedViewModel } from '../../utils/paged-view-model';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    public async create(payload: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data: payload,
        });
    }

    public async findAll(
        pagination: IPagination,
        filters?: Prisma.UserWhereInput,
        orderBy?: Prisma.UserOrderByWithRelationInput[]
    ): Promise<User[] | PagedViewModel<User>> {


        if (pagination.enable) {
            const skip = pagination.skip;
            const take = pagination.take;

            const [users, count] = await this.prisma.$transaction([
                this.prisma.user.findMany({
                    skip: skip,
                    take: take,
                    where: filters ?? {},
                    orderBy: orderBy ?? {},
                }),
                this.prisma.user.count({
                    where: filters,
                }),
            ]);

            const paged = new Paged(users, count);
            return new PagedViewModel(paged, take, skip);
        } else {
            return await this.prisma.user.findMany({
                where: filters,
            });
        }
    }
}
