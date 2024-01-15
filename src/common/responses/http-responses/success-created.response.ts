import {HttpStatus, Injectable} from '@nestjs/common';
import {ResponseModel} from './response';

@Injectable()
export class SuccessCreatedResponse extends ResponseModel<any> {
    constructor(data?: any) {
        super(HttpStatus.CREATED, true, null, data, null);
    }
}