import {
    IsString
} from 'class-validator';
import { MeetMessagesHelper } from 'src/meet/helpers/meetmessages.helper';

export class JoinRoomDto {
    @IsString({ message: MeetMessagesHelper.JOIN_DATA_VALIDATION })
    userId: string;

    @IsString({ message: MeetMessagesHelper.JOIN_DATA_VALIDATION })
    link: string;
}