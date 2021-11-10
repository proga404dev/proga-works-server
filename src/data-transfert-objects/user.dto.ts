import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    public readonly firstname: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    public readonly lastname: string;

    @ApiProperty({ required: false })
    @IsNotEmpty()
    @IsOptional()
    public readonly nickname?: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    public readonly email: string;

    @ApiProperty({ required: true, example: '+XXXXXXXXXXX' })
    @IsNotEmpty()
    @IsString()
    @IsMobilePhone()
    public readonly mobilePhoneNumber: string;
}