import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async validateUser(email: string, password: string): Promise<any> {
    const result = { data: null, error: null };
    const userDoc = await this.userRepository.findOne({ email: email });

    if (!userDoc) {
      result.error = 'User not found';
      return result;
    }

    // check isDeleted [soft delted]
    if (userDoc && userDoc.isDeleted != null) {
      result.error = 'User not found';
      return result;
    }

    //check the password
    if (userDoc && userDoc.password) {
      const isCorrectPassword = bcryptjs.compareSync(
        password,
        userDoc.password,
      );
      if (!isCorrectPassword) {
        result.error = 'Incorrect password';
        return result;
      }
    }

    delete userDoc['password'];
    result.data = userDoc;
    return result;
  }
}
