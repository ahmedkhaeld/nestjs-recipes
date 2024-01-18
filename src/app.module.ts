import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessEnv } from 'src/env/process.env';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/src/env/${process.env.NODE_ENV}.env`,
      load: [ProcessEnv],
    }),

    /**
     * Mongoose Module
     * (NOTE - the following plugins are registered for all schemas at once INSTEAD of register them each time we create new schema)
     */
    MongooseModule.forRoot(ProcessEnv().mongodb.connectionUrl, {
      connectionFactory: (nativeMongooseConnection) => {
        //NOTE - it is important to to call the plugin with require,
        //because the should have already been registered synchronously with the plugin manager
        //then return the connection

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        nativeMongooseConnection.plugin(require('mongoose-paginate-v2'));
        nativeMongooseConnection.plugin(
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require('mongoose-aggregate-paginate-v2'),
        );
        return nativeMongooseConnection;
      },
    }),
    UserModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
