export interface IResponseModel<T> {
    statusCode: number;
    status: boolean;
    error: string;
    data: T;
    feedback: T;
  }
  
  export class ResponseModel<T> implements IResponseModel<T> {
    statusCode: number;
    status: boolean;
    error: string;
    data: T;
    feedback: T;
  
    constructor(statusCode: number, status: boolean, error: string, data?: any, feedback?: any) {
      this.statusCode = statusCode;
      this.status = status;
      this.error = error || '';
      this.data = data || {};
      this.feedback = feedback || {};
    }
  
    getStatusCode() {
      return this.statusCode;
    }
  
    getStatus() {
      return this.status;
    }
  
    getError() {
      return this.error;
    }
  
    getData() {
      return this.data;
    }
  
    getFeedback() {
      return this.feedback;
    }
  
    getResponseObject() {
      return {
        statusCode: this.statusCode, status: this.status, error: this.error, data: this.data, feedback: this.feedback,
      };
    }
  }