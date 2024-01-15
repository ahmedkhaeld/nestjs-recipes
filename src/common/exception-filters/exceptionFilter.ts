import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InternalServerErrorResponse } from '../responses/http-responses/internal-server-error.response';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { HTTP_RESPONSE_CLASSES } from '../responses/http-responses/base.responses';
import { ExceptionsFeedback } from '../application-feedback/exceptions.feedback';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

/**
 * Handles exceptions globally, converting them into standardized responses based on their HTTP status codes.
 *
 * @param exception - The exception to be caught and processed.
 * @param host - The host context containing information about the current execution context.
 * @returns {void}
 */
catch(exception: unknown, host: ArgumentsHost): void {
  // Extracting the HTTP adapter from the host context
  const { httpAdapter } = this.httpAdapterHost;

  // Obtaining the HTTP context from the host
  const ctx = host.switchToHttp();

  // Logging the request details and the caught exception
  this.logRequestAndException(ctx, exception);

  // Determining the HTTP status code of the exception
  const httpStatus =
    exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

  // Mapping the HTTP status code to the corresponding response class
  const ResponseClass = HTTP_RESPONSE_CLASSES[httpStatus] || InternalServerErrorResponse;

  // Creating an instance of the appropriate response class
  const myRes = new ResponseClass(exception instanceof HttpException
    ? exception.getResponse()
    : ExceptionsFeedback.UNEXPECTED_ERROR);

  // Sending the response to the client
  httpAdapter.reply(ctx.getResponse(), myRes.getResponseObject(), httpStatus);
}


  /**
 * Logs the request and exception and sends a response to the client.
 * @param {HttpArgumentsHost} ctx - The HTTP context.
 * @param {unknown} exception - The exception that was thrown.
 */
  private logRequestAndException(ctx: HttpArgumentsHost, exception: unknown): void {
    const { getRequestUrl } = this.httpAdapterHost.httpAdapter;
    const requestUrl = getRequestUrl(ctx.getRequest());
    this.logger.error(`[${new Date().toISOString()}] [Request Url] ${requestUrl} [Exception] ${exception}`);
  }
}