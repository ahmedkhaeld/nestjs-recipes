import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../schema/user.schema';
import { Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { ListUsersDto } from '../dto/list-users.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async CreateUser(payload: CreateUserDto): Promise<User> {
    // hash the password
    const salt = bcryptjs.genSaltSync(10);
    payload.password = bcryptjs.hashSync(payload.password, salt);

    const userData: User = {
      email: payload.email,
      password: payload.password,
      personalInformation: {
        image: payload.personalInformation.image,
        dob: payload.personalInformation.dob,
        firstName: payload.personalInformation.firstName,
        middleName: payload.personalInformation.middleName,
        lastName: payload.personalInformation.lastName,
        gender: payload.personalInformation.gender,
        countryCode: payload.personalInformation.countryCode,
        phoneNumber: payload.personalInformation.phoneNumber,
        nationality: payload.personalInformation.nationality,
      },
    };
    return this.userRepository.create(userData);
  }

  
  async GetUserById(userId: string): Promise<User> {
    
    const id = new Types.ObjectId(userId);
   return this.userRepository.findOne({_id: id})
  }

  async GetAllUsers(): Promise<User[]> {
    return this.userRepository.find({})
  }

  async ListUsers(query: ListUsersDto): Promise<any> {
    const _query = {};
    const _options = {
      page: query.page || 1,
      limit: query.limit || 25,
      pagination: query.paginated || false,
      allowDiskUse: true,
    };

    const result = await this.userRepository.ListUsers(_query, _options);

    return result;

  }

}
