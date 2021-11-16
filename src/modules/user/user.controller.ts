import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { CustomValidationPipe } from '../../pipes/validation.pipe';
import { CreateUserDto } from '../../data-transfert-objects/user.dto';
import { UserService } from '../../services/user/user.service';
import { IUserQueryParams } from 'src/interfaces/user-query-params.interface';
import { filter } from 'rxjs';

@ApiTags('User')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('user')
    @ApiOkResponse({ description: 'Create a user' })
    @ApiBody({ type: CreateUserDto })
    @UsePipes(new CustomValidationPipe())
    public async create(@Body() payload: CreateUserDto): Promise<User> {
        try {
            return await this.userService.create({
                firstname: payload.firstname,
                lastname: payload.lastname,
                nickname: payload.nickname ?? null,
                email: payload.email,
                mobilePhoneNumber: payload.mobilePhoneNumber,
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('users')
    @ApiOkResponse({ description: 'Get users' })
    @ApiQuery({
        name: 'pagination',
        required: false,
    })
    @ApiQuery({
        name: 'skip',
        required: false,
    })
    @ApiQuery({
        name: 'take',
        required: false,
    })
    @ApiQuery({
        name: 'orderBy',
        description: 'firstname | lastname | email | createdAt',
        required: false,
    })
    @ApiQuery({
        name: 'term',
        description: 'asc or desc',
        required: false,
    })
    @ApiQuery({
        name: 'firstname',
        description: 'Firstname of user',
        required: false,
    })
    @ApiQuery({
        name: 'lastname',
        description: 'Lastname of user',
        required: false,
    })
    @ApiQuery({
        name: 'nickname',
        description: 'Nickname of user',
        required: false,
    })
    @ApiQuery({
        name: 'email',
        description: 'Email of user',
        required: false,
    })
    @ApiQuery({
        name: 'mobilePhoneNumber',
        description: 'Mobile phone number',
        required: false,
    })
    public async findAll(@Query() query: IUserQueryParams) {
        try {
            const filters: Prisma.UserWhereInput = {}
            const orderBy: Prisma.UserOrderByWithRelationInput[] = []

            if (query) {
                if (query.firstname) {
                    filters.firstname = { contains: query.firstname }
                }
                if (query.lastname) {
                    filters.lastname = { contains: query.lastname }
                }
                if (query.nickname) {
                    filters.nickname = { contains: query.nickname }
                }
                if (query.email) {
                    filters.email = { contains: query.email }
                }
                if (query.mobilePhoneNumber) {
                    filters.email = { contains: query.email }
                }
                if (query.mobilePhoneNumber) {
                    filters.mobilePhoneNumber = { contains: query.mobilePhoneNumber }
                }

                if (query.orderBy) {
                    const obj = {} as Prisma.UserOrderByWithRelationInput;
                    obj[query.orderBy] = query.term
                    orderBy.push(obj)
                }
            }

            return this.userService.findAll(
                {
                    enable: !query ? true : query.pagination === '0' ? false : true,
                    take: !query ? undefined : query.take ? +query.take : 10,
                    skip: !query ? undefined : query.skip ? +query.skip : 0,
                },
                filters,
                orderBy
            );
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
