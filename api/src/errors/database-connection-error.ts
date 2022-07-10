import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  reason = 'Error occurred while trying to connect to the database';
  statusCode = 503;

  constructor() {
    super('Error connection db');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return { messages: [this.reason] };
  }
}
