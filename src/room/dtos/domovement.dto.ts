import {
    IsNumber,
    Min,
    Max,
    IsString
} from 'class-validator';
import { MeetMessagesHelper } from 'src/meet/helpers/meetmessages.helper';

export class DoMovementDto {
    @IsString({ message: MeetMessagesHelper.JOIN_DATA_VALIDATION })
    link: string;
    
    @IsString({ message: MeetMessagesHelper.JOIN_DATA_VALIDATION })
    userId: string;

    @IsNumber({}, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
    @Min(0, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
    @Max(8, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
    x: number;

    @IsNumber({}, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
    @Min(0, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
    @Max(8, { message: MeetMessagesHelper.UPDATE_XY_VALIDATION })
    y: number;

    @IsString({ message: MeetMessagesHelper.UPDATE_ORIENTATION_VALIDATION })
    orientation: string;
}