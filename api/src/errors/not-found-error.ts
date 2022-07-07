import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public entity: string) {
    super(`The requested resource ${entity} could not be found`);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return {
      message: `The requested resource ${this.entity} could not be found`,
    };
  }
}
