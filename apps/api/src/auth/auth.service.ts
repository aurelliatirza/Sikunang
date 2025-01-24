import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {


    constructor(private readonly userService: UserService){}
    registerUser(CreateUserDto: CreateUserDto){
        const user = this.userService.findByUsername(CreateUserDto.username);
        if (user) throw new ConflictException("User already exist")
            return this.userService.create(CreateUserDto);
    }
}
