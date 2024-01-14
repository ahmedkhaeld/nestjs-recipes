import { Controller, Body, Get, Param, Post, Patch, Request, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../schema/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUserbyIdDto } from '../dto/get-user.dto';
import { ListUsersDto } from '../dto/list-users.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async CreateUser(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.CreateUser(user);
  }

  @Get(':userId')
  async GetUser(@Param() param: GetUserbyIdDto): Promise<any> {

    const response = await this.userService.GetUserById(param.userId)


    return response
  }

  @Get()
  async ListUsers(@Request() req, @Query() query: ListUsersDto) {
    const response = await this.userService.ListUsers(query);
    return response;
  }

}
