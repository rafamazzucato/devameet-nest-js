import { Controller, Get, HttpCode, HttpStatus, Param, } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(
        private readonly service: RoomService) { }

    @Get(':link')
    @HttpCode(HttpStatus.OK)
    async updateMeet(@Param() params) {
        const { link } = params;
        return await this.service.getRoom(link);
    }
}
