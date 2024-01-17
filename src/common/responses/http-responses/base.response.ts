import { BadRequestResponse } from "./bad-request.response";
import { ForbiddenResponse } from "./forbidden-request.response";
import { InternalServerErrorResponse } from "./internal-server-error.response";
import { InvalidParamsResponse } from "./invalid-params.response";
import { NotFoundResponse } from "./not-found.response";
import { UnAuthorizedResponse } from "./un-authorized.response";

// Map status codes to response classes
  export const HTTP_RESPONSE_MAP = {
    400: BadRequestResponse,
    422: InvalidParamsResponse,
    401: UnAuthorizedResponse,
    403: ForbiddenResponse,
    404 : NotFoundResponse,
    500: InternalServerErrorResponse,

  }