import {HttpStatus, Injectable} from '@nestjs/common';
import {ResponseModel} from './response';

@Injectable()
export class SuccessResponse extends ResponseModel<any> {
    constructor(data?: any) {
        super(HttpStatus.OK, true, null, data, null);
    }
}