import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { USER_COLLECTION_NAME, UserSchema } from './schema/user.schema';
import { Connection } from 'mongoose';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { IsUserIdExistValidator } from './validator/user-id-exists.validator';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: USER_COLLECTION_NAME,
        useFactory: async (nativeMongooseConnection: Connection) => {
          const schema = UserSchema;

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [
    UserService,
    UserRepository,
    IsUserIdExistValidator,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
