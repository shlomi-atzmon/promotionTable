import { Request, Response, NextFunction } from 'express';
import PaginatedResults from '../types/paginated-results';

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
export const paginate = (model: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let { cursor } = req.query as QueryString;
    const page = parseInt(cursor) || 1;
    const limit = 20;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total: number = await model.countDocuments().exec();
    const pages = Math.ceil(total / limit);

    const data: PaginatedResults = {
      limit,
      total,
      pages,
      results: [],
    };

    if (endIndex < total) {
      data.nextPage = page + 1;
    }

    if (startIndex > 0) {
      data.previousPage = page - 1;
    }
    data.results = await model.find().limit(limit).skip(startIndex).exec();
    res.paginatedResults = data;
    next();
  };
};
