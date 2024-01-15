import {HttpStatus, Injectable} from '@nestjs/common';
import {ResponseModel} from './response';
import {ResponseErrors} from "./status-codes.constants";

@Injectable()
export class UnAuthorizedResponse extends ResponseModel<any> {
    constructor(feedback?: any) {
        super(HttpStatus.UNAUTHORIZED, false, ResponseErrors.UNAUTHORIZED, null, feedback);
    }
}