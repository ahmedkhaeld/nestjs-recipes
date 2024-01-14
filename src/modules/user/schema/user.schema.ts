import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GenderTypes } from '../enum/gender.enum';

export const USER_COLLECTION_NAME = 'User';

@Schema({ _id: false })
export class PersonalInformationObject {
  @Prop({ type: String, required: false, default: null })
  image?: string;

  @Prop({ type: String, required: false })
  firstName?: string;

  @Prop({ type: String, default: null })
  middleName?: string;

  @Prop({ type: String, default: null })
  lastName?: string;

  @Prop({ type: String, enum: GenderTypes, required: false })
  gender?: string;

  @Prop({ type: String, default: null })
  countryCode?: string;

  @Prop({ type: String, required: false, default: null })
  phoneNumber?: string;

  @Prop({ type: String, required: false })
  dob?: string;
  @Prop({ type: String, required: false })
  nationality?: string;
}

export const PersonalInformationObjectSchema = SchemaFactory.createForClass(
  PersonalInformationObject,
);
PersonalInformationObjectSchema.index(
  { phoneNumber: 1, countryCode: 1 },
  { unique: true },
);
PersonalInformationObjectSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { phoneNumber: { $type: 'string' } },
  },
);

/**
 * User Schema
 */
export type UserDocument = User & Document;

@Schema({ collection: USER_COLLECTION_NAME, autoIndex: true, timestamps: true })
export class User {
  _id?: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    lowercase: true,
    trim: true,
  })
  email?: string;

  @Prop({ type: String, required: false })
  password?: string;

  @Prop({ type: Boolean, default: false })
  isBlocked?: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: Boolean, default: false })
  isScheduledForDelete?: boolean;

  @Prop({ type: Date, default: null })
  emailVerifiedAt?: Date;

  @Prop({ type: Date, default: null })
  phoneVerifiedAt?: Date;

  @Prop({ type: PersonalInformationObjectSchema, default: null })
  personalInformation?: PersonalInformationObject;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
UserSchema.index({ isBlocked: 1 });
UserSchema.index({ isDeleted: 1 });
UserSchema.index({ 'personalInformation.firstName': 1 });
UserSchema.index({ 'personalInformation.countryCode': 1 });
UserSchema.index({ 'personalInformation.phoneNumber': 1 });
UserSchema.index(
  {
    'personalInformation.countryCode': 1,
    'personalInformation.phoneNumber': 1,
  },
  { unique: true },
);
