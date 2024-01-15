import { HttpStatus } from "@nestjs/common";
import { BadRequestResponse } from "./bad-request.response";
import { ForbiddenResponse } from "./forbidden-request.response";
import { InternalServerErrorResponse } from "./internal-server-error.response";
import { InvalidParamsResponse } from "./invalid-params.response";
import { NotFoundResponse } from "./not-found.response";
import { UnAuthorizedResponse } from "./un-authorized.response";

// Map status codes to response classes
export const HTTP_RESPONSE_CLASSES = new Map([
    [HttpStatus.BAD_REQUEST, BadRequestResponse],
    [HttpStatus.UNPROCESSABLE_ENTITY, InvalidParamsResponse],
    [HttpStatus.UNAUTHORIZED, UnAuthorizedResponse],
    [HttpStatus.FORBIDDEN, ForbiddenResponse],
    [HttpStatus.NOT_FOUND, NotFoundResponse],
    [HttpStatus.INTERNAL_SERVER_ERROR, InternalServerErrorResponse],
  ]);