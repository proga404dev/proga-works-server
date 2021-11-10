import { Prisma, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    public async create(payload: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data: payload,
        });
    }
}
