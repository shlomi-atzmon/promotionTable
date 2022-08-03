import express from "express";

// Augment the default behaviour of error handling in async function
import "express-async-errors";
import cors from "cors";

// Routes
import { promotionRouter } from "./routes/index";

// Middlewares
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

// App Config
const app = express();
app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Route Handlers
app.use(promotionRouter);

app.all("*", async () => {
  throw new NotFoundError("Route");
});

// Middleware Handler
app.use(errorHandler);

export default app;
