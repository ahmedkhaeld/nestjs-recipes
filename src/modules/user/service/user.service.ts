import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { User } from '../schema/user.schema';
import { Types } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { ListUsersDto } from '../dto/list-users.dto';
import { IServiceResponse } from 'src/common/interfaces/service.response';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async CreateUser(payload: CreateUserDto): Promise<IServiceResponse> {
    const serviceResponse: IServiceResponse = { data: null, error: null };
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
    const newUser = await this.userRepository.create(userData);

    serviceResponse.data = {
      user: newUser,
    };
    return serviceResponse;
  }

  async GetUserById(userId: string): Promise<IServiceResponse> {
    try {
      const response: IServiceResponse = { data: null, error: null };
      const id = new Types.ObjectId(userId);
      const userData = await this.userRepository.findOne({ _id: id });
      response.data = {
        user: userData,
      };
      return response;
    } catch (exception) {
      console.log(exception);
      throw new InternalServerErrorException(exception);
    }
  }

  async GetUserByEmail(email: string): Promise<IServiceResponse> {
    try {
      const response: IServiceResponse = { data: null, error: null };

      const userData = await this.userRepository.findOne({ email: email });
      response.data = {
        user: userData,
      };
      return response;
    } catch (exception) {
      console.log(exception);
      throw new InternalServerErrorException(exception);
    }
  }

  async GetAllUsers(): Promise<User[]> {
    return this.userRepository.find({});
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
