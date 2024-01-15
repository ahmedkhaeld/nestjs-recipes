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
import { ExceptionsFeedback } from '../application-feedback/exceptions.feedback';
import { InvalidParamsResponse } from '../responses/http-responses/invalid-params.response';
import { BadRequestResponse } from '../responses/http-responses/bad-request.response';
import { UnAuthorizedResponse } from '../responses/http-responses/un-authorized.response';
import { ForbiddenResponse } from '../responses/http-responses/forbidden-request.response';
import { NotFoundResponse } from '../responses/http-responses/not-found.response';

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

    let clientResponse = null;
   switch (httpStatus) {
    case HttpStatus.BAD_REQUEST:
      if (exception instanceof HttpException) {
        clientResponse = new BadRequestResponse(exception.getResponse());
      } else {
        clientResponse = new BadRequestResponse();
      }
      httpAdapter.reply(
        ctx.getResponse(),
        clientResponse.getResponseObject(),
        httpStatus,
      );
      break;
    case HttpStatus.UNPROCESSABLE_ENTITY:
      if (exception instanceof HttpException) {
        clientResponse = new InvalidParamsResponse(exception.getResponse());
      } else {
        clientResponse = new InvalidParamsResponse();
      }
      httpAdapter.reply(
        ctx.getResponse(),
        clientResponse.getResponseObject(),
        httpStatus,
      );
      break;
    case HttpStatus.UNAUTHORIZED:
      if (exception instanceof HttpException) {
        clientResponse = new UnAuthorizedResponse(exception.getResponse());
      } else {
        clientResponse = new UnAuthorizedResponse();
      }
      httpAdapter.reply(
        ctx.getResponse(),
        clientResponse.getResponseObject(),
        httpStatus,
      );
      break;
    case HttpStatus.FORBIDDEN:
      if (exception instanceof HttpException) {
        clientResponse = new ForbiddenResponse(exception.getResponse());
      } else {
        clientResponse = new ForbiddenResponse();
      }
      httpAdapter.reply(
        ctx.getResponse(),
        clientResponse.getResponseObject(),
        httpStatus,
      );
      break;
    case HttpStatus.NOT_FOUND:
      if (exception instanceof HttpException) {
        clientResponse = new NotFoundResponse(exception.getResponse());
      } else {
        clientResponse = new NotFoundResponse();
      }
      httpAdapter.reply(
        ctx.getResponse(),
        clientResponse.getResponseObject(),
        httpStatus,
      );
      break;
    default:
      if (exception instanceof HttpException) {
        clientResponse = new InternalServerErrorResponse(exception.getResponse());
      } else {
        clientResponse = new InternalServerErrorResponse(ExceptionsFeedback.UNEXPECTED_ERROR);
      }
      httpAdapter.reply(
        ctx.getResponse(),
        clientResponse.getResponseObject(),
        httpStatus,
      );
  }
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