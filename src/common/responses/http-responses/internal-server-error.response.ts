
import {HttpStatus, Injectable} from '@nestjs/common';
import {ResponseModel} from './response';
import {ResponseErrors} from "./status-codes.constants";

@Injectable()
export class InternalServerErrorResponse extends ResponseModel<any> {
    constructor(feedback?: any) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, false, ResponseErrors.INTERNAL_SERVER_ERROR, null, feedback);
    }
}