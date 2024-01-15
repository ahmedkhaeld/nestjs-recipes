import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, USER_COLLECTION_NAME } from '../schema/user.schema';
import {
  ClientSession,
  Connection,
  Model,
  QueryOptions,
  Types,
  FilterQuery,
} from 'mongoose';

import { AggregratePaginateModel, PaginateModel, AggregatePaginateResult, PaginateResult } from 'mongoose-aggregate-paginate-v2'
import { ExceptionsFeedback } from 'src/common/application-feedback/exceptions.feedback';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(USER_COLLECTION_NAME) private userModel: Model<User>,
    @InjectModel(USER_COLLECTION_NAME) private userAggregatePaginateModel: AggregratePaginateModel<User>,
    @InjectModel(USER_COLLECTION_NAME) private userPaginateModel: PaginateModel<User>,
  ) {}

    /**
   * Creates a new user document in the collection.
   * @param {User} user - The user document to create.
   * @returns {Promise<User>} The created user document.
   */
    async create(user: User): Promise<User> {
      try {
        const newUser = new this.userModel(user);
      return newUser.save();
      } catch(exception){
        console.log(exception)
        throw new InternalServerErrorException(ExceptionsFeedback.UNEXPECTED_ERROR);
      }
    }

  /**
   * Searches for multiple user documents in the collection based on the filter criteria specified.
   * @param {FilterQuery<User>} filterQuery - The filter query to find the user documents.
   * @returns {Promise<User[]>} The found user documents.
   */
  async find(filterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(filterQuery);
  }
  /**
   * Searches for a single user document in the collection based on the filter criteria specified.
   * @param {FilterQuery<User>} filterQuery - The filter query to find the user document.
   * @returns {Promise<User>} The found user document, or null if no match is found.
   */
  async findOne(filterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(filterQuery);
  }

  async ListUsers(_query: any, _options: any): Promise<PaginateResult<User>>{
    const pipelines : any = [
      {
        $match: _query,
      },
    ];

    const aggregate = this.userAggregatePaginateModel.aggregate(pipelines);
    return this.userAggregatePaginateModel.aggregatePaginate(aggregate, _options, 
        async (error, result) => {
          if(error) {
            console.error(error);
            throw new InternalServerErrorException(error);
          }
          return result;
        }
      );
  }


  /**
   * Updates a single document in the collection based on the filter criteria specified.
   * @param {FilterQuery<User>} filterQuery - The filter query to find the document to update.
   * @param {Partial<User>} user - The fields to update in the document.
   * @returns {Promise<User>} The updated document.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<User>,
    update: Partial<User>,
    upsert?: boolean,
    after?: boolean,
    session?: ClientSession,
    projectionExecludeCredentials = true,
  ): Promise<User> {
    //Execlude deleted
    const filterKeys = Object.keys(filterQuery);
    if (filterKeys.length === 0 || !filterKeys.includes('deletedAt')) {
      filterQuery['deletedAt'] = { $eq: null };
    }

    const queryOptions: QueryOptions = {
      upsert: upsert || false,
      new: after || false,
      session: session || null,
    };

    const userDoc = this.userModel.findOneAndUpdate(
      filterQuery,
      update,
      queryOptions,
    );

    //Remove fields like password
    if (userDoc && projectionExecludeCredentials === true) {
      if (userDoc['_doc'].password) delete userDoc['_doc'].password;
    }

    return userDoc;
  }

  async UpdateMany(
    filter: any,
    update: any,
    upsert?: boolean,
    multi?: boolean,
    arrayFilters?: { [key: string]: any }[],
    session?: ClientSession,
  ): Promise<any> {
    const updateOptions: any  = {
      arrayFilters: arrayFilters || [],
      bypassDocumentValidation: false,
      upsert: upsert || false,

    };
    await this.userModel.updateMany(filter, update, updateOptions);
    return;
  }

  async delete(filterQuery: FilterQuery<User>): Promise<any> {
    return this.userModel.deleteOne(filterQuery);
  }

  async softDelete(userFilterQuery: FilterQuery<User>): Promise<any> {
    return this.userModel.findOneAndUpdate(userFilterQuery, {
      isDeleted: true,
    });
  }
}
