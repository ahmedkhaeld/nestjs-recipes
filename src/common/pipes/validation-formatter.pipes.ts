import { ValidationError } from "class-validator";
import { ValidationErrorMessage } from "../application-feedback/validations.feedback";
import { UnprocessableEntityException } from "@nestjs/common";
import { ExceptionsFeedback } from "../application-feedback/exceptions.feedback";
/**
 * Formats validation errors from class-validator into a structured format for NestJS global pipes.
 *
 * @param validationErrors An array of ValidationError objects.
 * @returns An UnprocessableEntityException with formatted error data.
 */
export function ValidationErrorsFormat(validationErrors: ValidationError[]): UnprocessableEntityException {
  /** Stores formatted errors in a key-value structure, where keys are property names and values are arrays of error messages. */
  const myValidationErrors: { [key: string]: any } = {};

  /**
   * Recursively formats validation errors, handling nested errors appropriately.
   *
   * @param validationErrors The validation errors to format.
   * @param property Optional property name for nested errors.
   */
  function _ValidationErrorsFormat(validationErrors: ValidationError[], property?: string) {
    for (const validationError of validationErrors) {
      if (
        validationError.children != undefined &&
        validationError.children.length > 0
      ) {
        console.log({ validationError }); // Log validation error for debugging
        _ValidationErrorsFormat(validationError.children, validationError.property);
      } else {
        // Construct the key name, including parent properties for nested errors
        const key = property != undefined && property.length > 0
          ? property + '.' + validationError.property
          : validationError.property;

        // Retrieve constraint names and map them to user-friendly messages
        myValidationErrors[key] = [];
        const constraints = Object.keys(validationError.constraints);
        for (const constraint of constraints) {
          myValidationErrors[key].push(ValidationErrorMessage[constraint]);
        }
      }
    }
  }

  _ValidationErrorsFormat(validationErrors);

  // Create the structured exception with formatted errors
  const invalidParams = ExceptionsFeedback.INVALID_PARAMS;
  invalidParams.fields = myValidationErrors;
  return new UnprocessableEntityException(invalidParams);
}

