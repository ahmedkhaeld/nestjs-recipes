import {HttpStatus, Injectable} from '@nestjs/common';
import {ResponseModel} from './response';
import {ResponseErrors} from './status-codes.constants'

@Injectable()
export class NotFoundResponse extends ResponseModel<any> {
    constructor(feedback?: any) {
        super(HttpStatus.NOT_FOUND, false, ResponseErrors.NOT_FOUND, null, feedback);
    }
}