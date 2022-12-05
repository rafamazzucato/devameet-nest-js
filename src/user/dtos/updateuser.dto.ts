import {
    IsNotEmpty,
    MinLength,
    IsString
} from 'class-validator';
import { MessagesHelper } from 'src/auth/helpers/messages.helper';

export class UpdateUserDto {
    @IsNotEmpty({ message: MessagesHelper.REGISTER_NAME_NOT_FOUND })
    @MinLength(2, { message: MessagesHelper.REGISTER_NAME_NOT_FOUND })
    name: string;

    @IsString()
    avatar: string;
}