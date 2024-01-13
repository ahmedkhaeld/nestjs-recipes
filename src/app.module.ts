import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessEnv } from 'src/env/process.env';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/src/env/${process.env.NODE_ENV}.env`,
      load: [ProcessEnv],
    }),
    
    MongooseModule.forRoot(ProcessEnv().mongodb.connectionUrl),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
