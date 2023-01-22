import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request } from '@nestjs/common';
import { CreateMeetDto } from './dtos/createmeet.dto';
import { GetMeetDto } from './dtos/getmeet.dto';
import { UpdateMeetDto } from './dtos/updatemeet.dto';
import { MeetService } from './meet.service';

@Controller('meet')
export class MeetController {
    constructor(
        private readonly service: MeetService) { }

    @Get()
    async getUser(@Request() req) {
        const { userId } = req?.user;
        const result = await this.service.getMeetsByUser(userId);

        return result?.map((m) => ({
            id: m._id.toString(),
            name: m.name,
            color: m.color,
            link: m.link,
        }) as GetMeetDto);
    }

    @Get('objects/:id')
    async getMeetObjects(@Request() req, @Param() params) {
        const { userId } = req?.user;
        const { id } = params;
        const result = await this.service.getMeetObjects(id, userId);

        return result;
    }

    @Get(':id')
    async getMeetById(@Request() req,  @Param() params){
        const { userId } = req?.user;
        const { id } = params;

        return await this.service.getMeetById(id, userId);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async create(@Request() req, @Body() dto: CreateMeetDto) {
        const { userId } = req?.user;
        await this.service.create(userId, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMeet(@Param() params, @Request() req) {
        const { userId } = req?.user;
        const { id } = params;
        await this.service.delete(userId, id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async updateMeet(@Param() params, @Request() req, @Body() dto: UpdateMeetDto) {
        const { userId } = req?.user;
        const { id } = params;
        await this.service.update(userId, id, dto);
    }
}
