import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CustomValidationPipe } from '../../pipes/validation.pipe';
import { CreateUserDto } from '../../data-transfert-objects/user.dto';
import { UserService } from '../../services/user/user.service';

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
}
