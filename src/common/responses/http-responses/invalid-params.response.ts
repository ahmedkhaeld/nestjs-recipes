import {HttpStatus, Injectable} from '@nestjs/common';
import {ResponseModel} from './response';
import {ResponseErrors} from "./status-codes.constants";


@Injectable()
export class InvalidParamsResponse extends ResponseModel<any> {
    constructor(feedback?: any) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, false, ResponseErrors.UNPROCESSABLE_ENTITY, null, feedback);
    }
}