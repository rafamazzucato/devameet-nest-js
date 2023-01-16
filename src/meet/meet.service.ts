import { Injectable, Logger } from '@nestjs/common';
import { Meet, MeetDocument } from './schemas/meet.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMeetDto } from './dtos/createmeet.dto';
import { UserService } from 'src/user/user.service';
import { generateLink } from './utils/linkgenerator.utils';
import { UpdateMeetDto } from './dtos/updatemeet.dto';
import { MeetObject, MeetObjectDocument } from './schemas/meetobjects.schema';

@Injectable()
export class MeetService {
    private logger = new Logger(MeetService.name);

    constructor(
        @InjectModel(Meet.name) private model: Model<MeetDocument>,
        @InjectModel(MeetObject.name) private objectModel: Model<MeetObjectDocument>,
        private readonly userService : UserService) { }

    async getMeetsByUser(userId: string) {
        this.logger.debug('getMeetsByUser - start');
        return await this.model.find({ user: userId });
    }

    async getMeetObjects(meetId: string, userId: string) {
        this.logger.debug('getMeetObjects - start');
        const user = await this.userService.getUserById(userId);
        const meet = await this.model.findOne({_id: meetId, user: user});
        return await this.objectModel.find({ meet });
    }

    async create(userId: string, dto: CreateMeetDto) {
        this.logger.debug('create - start');
        
        const user = await this.userService.getUserById(userId);
        const payload = {
            ...dto,
            user,
            link : generateLink()
        };
        this.logger.debug('create - payload before save', payload);

        const createdUser = new this.model(payload);
        return createdUser.save();
    }

    async delete(userId: string, meetId: string) {
        this.logger.debug('delete - start');
        return await this.model.deleteOne({ user: userId, _id: meetId });
    }

    async update(userId: string, meetId: string, dto : UpdateMeetDto) {
        this.logger.debug('update - start');

        const user = await this.userService.getUserById(userId);
        const meet = await this.model.findOne({_id: meetId, user: user});

        this.logger.debug('update - set new values on meet');
        meet.name = dto.name;
        meet.color = dto.color;
        await this.model.findByIdAndUpdate({_id: meetId}, meet);

        this.logger.debug('update - delete previous objects');
        await this.objectModel.deleteMany({meet});

        let objectPayload;
        this.logger.debug('update - insert new objects');
        for (const object of dto.objects) {
            objectPayload = {
                meet,
                ...object
            }
            
            await this.objectModel.create(objectPayload);
        }
    }
}