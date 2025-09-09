import {
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

/**
 * Change the status code of the validation pipe to 422 instead of 400.
 * This class will extend from NestJS's default ValidationPipe and
 * override the transform method in order to change the status code of
 * the data validation error from 400 (Bad Request) to 422 (Unprocessable Entity).
 *
 * ? Use this class instead of original validation pipe.
 */
export class ValidationPipe422 extends ValidationPipe {
  /** Overrides the transform method to handle validation errors */
  public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    try {
      /** Calls the parent class's transform method to validate the input value */
      return await super.transform(value, metadata);
    } catch (err) {
      /** Checks if the error is an instance of BadRequestException */
      if (err instanceof BadRequestException) {
        /** Retrieve the HTTP response object from err object */
        const exceptionResponse: string | object = err.getResponse();

        let message: string = '';

        /** Check if the response is an object or a string */
        if (typeof exceptionResponse === 'string') {
          /** Handle case where the response is a string */
          message = exceptionResponse;
        } else if (
          /** Check if the data is and object with a message property */
          typeof exceptionResponse === 'object' &&
          'message' in exceptionResponse
        ) {
          /** Handle case where the response is an object */
          message = (exceptionResponse as { message: string }).message;
        }

        /** throw a new error as "Unprocessable Entity" exception */
        throw new UnprocessableEntityException(message);
      }
    }
  }
}
