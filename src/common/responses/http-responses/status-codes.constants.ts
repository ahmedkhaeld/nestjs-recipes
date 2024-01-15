//Response Error object holds the possible errors encountered during the request operation and the response
export enum ResponseErrors {
    BAD_REQUEST = "BadRequest",
    NOT_FOUND = "NotFound",
    FORBIDDEN = "Forbidden",
    INTERNAL_SERVER_ERROR = "InternalServerError",
    UNPROCESSABLE_ENTITY = "InvalidParams",
    UNAUTHORIZED = "Unauthorized",
    OK = "Success"
}
