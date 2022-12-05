import { Body, Controller, Get, HttpCode, HttpStatus, Put, Request } from '@nestjs/common';
import { GetUserResponseDto } from './dtos/getuser.response.dto';
import { UpdateUserDto } from './dtos/updateuser.dto';
import { UserService } from './user.service';

@Controller("user")
export class UserController {
    constructor(
        private readonly service: UserService) { }

    @Get()
    async getUser(@Request() req) {
        const {userId} = req?.user;
        const result =  await this.service.getUserById(userId);

        return {
            name: result.name, 
            email: result.email, 
            avatar: result.avatar, 
            id: result._id.toString()
        };
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    async updateUser(@Request() req, @Body() dto: UpdateUserDto){
        const {userId} = req?.user;
        await this.service.updateUser(userId, dto);
    }
}
