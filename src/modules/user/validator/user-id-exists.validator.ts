import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions } from "class-validator";
import { UserService } from "../service/user.service";
import { Types } from "mongoose";


@ValidatorConstraint({name: 'IsUserIdExist', async: true})
@Injectable()
export class IsUserIdExistValidator implements ValidatorConstraintInterface {
    constructor(private userService: UserService){}

    public async validate(value: string) {
        if(value == null || value === undefined) return false;

        if (Types.ObjectId.isValid(value)) {
            const userDoc = await this.userService.GetUserById(value);
            if (userDoc == null) return false;
            else return true;
        }
        return true;
    }

     public defaultMessage(validationArguments?: ValidationArguments): string {
        return JSON.stringify({en: 'user already exists', ar: 'user already exists'});    
    }
}

export function IsUserIdExist(validationOptions?: ValidationOptions) {
    return function(object: any, propertyName: string) {
        registerDecorator({
            name: 'IsUserIdExist',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsUserIdExistValidator,
        });
    };
}