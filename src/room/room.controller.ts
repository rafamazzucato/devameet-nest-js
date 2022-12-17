import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put, Request } from '@nestjs/common';
import { UpdatePositionDto } from './dtos/updateposition.dto';
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
