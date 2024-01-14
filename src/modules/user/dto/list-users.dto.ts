import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";
import { ToBoolean } from "../transformer/To-boolean.transformer";

export class ListUsersDto {
    
    @IsOptional()
    search: string;

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    @IsPositive()
    page: number;

    @IsOptional()
    @Type(()=>Number)
    @IsNumber()
    @IsPositive()
    limit: number;

    @IsOptional()
    @ToBoolean()
    paginated: boolean;
}