import { IsMongoId, IsNotEmpty } from "class-validator";
import { IsUserIdExist } from "../validator/user-id-exists.validator";

export class GetUserbyIdDto {
    @IsNotEmpty()
    @IsMongoId()
    @IsUserIdExist()
    userId: string;
}