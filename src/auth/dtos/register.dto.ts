import {
    IsEmail,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
    IsString
} from 'class-validator';
import { MessagesHelper } from '../helpers/messages.helper';


export class RegisterDto {
    @IsEmail({}, { message: MessagesHelper.AUTH_LOGIN_NOT_FOUND })
    email: string;

    @IsNotEmpty({ message: MessagesHelper.AUTH_PASSWORD_NOT_FOUND })
    @MinLength(4, { message: MessagesHelper.REGISTER_STRONG_PASSWORD })
    @MaxLength(20, { message: MessagesHelper.REGISTER_STRONG_PASSWORD,})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: MessagesHelper.REGISTER_STRONG_PASSWORD,
    })
    password: string;

    @IsNotEmpty({ message: MessagesHelper.REGISTER_NAME_NOT_FOUND })
    @MinLength(2, { message: MessagesHelper.REGISTER_NAME_NOT_FOUND })
    name: string;

    @IsString()
    avatar: string;
}