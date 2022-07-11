import { Request, Response, NextFunction } from 'express';
import PaginatedResults from '../types/paginated-results';
import { Model } from 'mongoose';

// Augment express Response object
declare global {
  namespace Express {
    interface Response {
      paginatedResults?: PaginatedResults;
    }
  }
}

type QueryString = { page: string; limit: string };

export const paginate = (model: Model<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let { page: cursor, limit: size } = req.query as QueryString;

    const page = parseInt(cursor) || 1;
    const limit = parseInt(size) || 30;

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
