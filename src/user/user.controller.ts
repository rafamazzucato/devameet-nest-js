import { Controller, Get, Request } from '@nestjs/common';
import { GetUserResponseDto } from './dtos/getuser.response.dto';
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
        } as GetUserResponseDto;
    }
}
