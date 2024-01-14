import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderTypes } from '../enum/gender.enum';

export class PersonalInformationDto {
  @IsOptional()
  image: string;

  @IsNotEmpty()
  @Type(() => String)
  firstName: string;

  @IsOptional()
  @Type(() => String)
  middleName: string;

  @IsNotEmpty()
  @Type(() => String)
  lastName: string;

  @IsNotEmpty()
  @Type(() => String)
  countryCode: string;

  @IsNotEmpty()
  @Type(() => String)
  phoneNumber: string;

  @IsNotEmpty()
  @Type(() => String)
  dob: string;

  @IsNotEmpty()
  @Type(() => String)
  nationality: string;

  @IsNotEmpty()
  @Type(() => String)
  @IsEnum(GenderTypes)
  gender: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Type(() => String)
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PersonalInformationDto)
  personalInformation: PersonalInformationDto;
}
