import {
    IsNumber,
    Min,
    Max,
    IsString,
    IsBoolean
} from 'class-validator';
import { MeetMessagesHelper } from 'src/meet/helpers/meetmessages.helper';

export class TogglMuteDto {
    @IsString({ message: MeetMessagesHelper.MUTE_DATA_VALIDATION })
    userId: string;

    @IsString({ message: MeetMessagesHelper.JOIN_DATA_VALIDATION })
    link: string;
    
    @IsBoolean({ message: MeetMessagesHelper.MUTE_DATA_VALIDATION })
    muted: boolean;
}