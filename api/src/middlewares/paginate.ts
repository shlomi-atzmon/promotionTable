import { Request, Response, NextFunction } from 'express';
import PaginatedResults from '../types/paginated-results';
import { DatabaseConnectionError } from '../errors/database-connection-error';

// Augment express Response object
declare global {
  namespace Express {
    interface Response {
      paginatedResults?: PaginatedResults;
    }
  }
}

type QueryString = { cursor: string };

// TODO: replace type any maybe to mongoose model
// TODO: add limit from client ?
export const paginate = (model: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let { cursor } = req.query as QueryString;
    const page = parseInt(cursor) || 1;
    const limit = 12;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: PaginatedResults = {
      info: {
        limit,
      },
      results: [],
    };

    results.info.total = await model.countDocuments().exec();

    if (endIndex < results.info.total!) {
      results.info.nextPage = page + 1;
    }

    if (startIndex > 0) {
      results.info.previousPage = page - 1;
    }

    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (e: any) {
      throw new DatabaseConnectionError();
    }
  };
};
