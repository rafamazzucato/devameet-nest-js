import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import { MeetObject, MeetObjectDocument } from 'src/meet/schemas/meetobjects.schema';
import { Model } from 'mongoose';
import { RoomMessagesHelper } from './helpers/roommessages.helper';
import { Position, PositionDocument } from './schemas/position.schema';
import { UpdatePositionDto } from './dtos/updateposition.dto';
import { UserService } from 'src/user/user.service';
import { TogglMuteDto } from './dtos/togglMute.dto';

@Injectable()
export class RoomService {
    private logger = new Logger(RoomService.name);

    constructor(
        @InjectModel(Meet.name) private meetModel: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private objectModel: Model<MeetObjectDocument>,
        @InjectModel(Position.name) private positionModel: Model<PositionDocument>,
        private readonly userService: UserService) { }

    async getRoom(link: string) {
        this.logger.debug('getRoom - start');
        
        const meet = await this._getMeet(link);
        const objects =  await this.objectModel.find({ meet });

        return {
            link,
            name: meet.name,
            color: meet.color,
            objects
        }
    }

    async listUsersPosition(link: string) {
        this.logger.debug('getRoom - listUsersPosition');
        
        const meet = await this._getMeet(link);

        return await this.positionModel.find({meet});
    }

    async deleteUserPosition(clientId: string) {
        this.logger.debug('getRoom - deleteUserPosition');
        await this.positionModel.deleteMany({clientId});
    }

    async updateUserPosition(userId: string, link: string, clientId: string, dto : UpdatePositionDto) {
        this.logger.debug('getRoom - updateUserPosition');
        
        const meet = await this._getMeet(link);
        const user = await this.userService.getUserById(userId);

        if(!meet || !user){
            return;
        }

        const position = {
            ...dto,
            meet,
            user,
            clientId,
            name: user.name,
            avatar: user.avatar
        };

        const usersInRoom = await this.positionModel.find({meet});

        if(usersInRoom && usersInRoom.length > 20){
            throw new BadRequestException(RoomMessagesHelper.ROOM_MAX_USERS);
        }

        const loggedUserInRoom = usersInRoom.find(u => {
            return u.user.toString() === user._id.toString() || u.clientId === clientId
        });

        if(loggedUserInRoom){
            await this.positionModel.findByIdAndUpdate({_id: loggedUserInRoom._id}, position);
        }else{
            await this.positionModel.create(position);
        }
    }

    async updateUserMute(dto : TogglMuteDto) {
        this.logger.debug('getRoom - updateUserMute');
        const meet = await this._getMeet(dto.link);
        const user = await this.userService.getUserById(dto.userId);
        await this.positionModel.updateMany({user, meet}, {muted: dto.muted});
    }

    async _getMeet(link: string){
        const meet =  await this.meetModel.findOne({ link });

        if(!meet){
            throw new BadRequestException(RoomMessagesHelper.ROOM_LINK_NOT_FOUND);
        }

        return meet;
    }

}
