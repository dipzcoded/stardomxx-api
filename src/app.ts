import express, { NextFunction, Request, Response } from "express";
import { userRoute } from "./routes/v1";
import {
  errorHandlerDevMiddlewareDev,
  notFoundRoute,
} from "./middlewares/v1/error";

const app = express();

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use(
  express.urlencoded({
    limit: "20mb",
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    message: "welcome",
  });
});

app.use("/api/users", userRoute);

app.use(notFoundRoute);

app.use(errorHandlerDevMiddlewareDev);

export { app };
