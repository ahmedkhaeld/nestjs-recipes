import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProcessEnv } from './env/process.env';
import { AllExceptionsFilter } from './common/exception-filters/exceptionFilter';
import { ValidationError, useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { ValidationErrorsFormat } from './common/pipes/validation-formatter.pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

  // binding ValidationPipe at the application level,
  //thus ensuring all endpoints are protected from receiving incorrect data.
  // finaly will return a formatted error message
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) =>
        ValidationErrorsFormat(errors),
    }),
  );

  await app.listen(ProcessEnv().port);
}
bootstrap();
