import express, { Request, Response } from 'express';
import cors from 'cors';

// Routes
import { promotionRouter } from './routes/index';

// Middlewares
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

// App Config
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route Handlers
app.use(promotionRouter);

// TODO: Add a custom error
app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError('Route');
});

// Middleware Handler
app.use(errorHandler);

export default app;
