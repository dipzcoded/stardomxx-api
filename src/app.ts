import express, { NextFunction, Request, Response } from "express";
import { userRoute, profileRoute, followRoute } from "./routes/v1";
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
    message: "welcome to stardomx api",
  });
});

app.use("/api/users", userRoute);
app.use("/api/profiles", profileRoute);
app.use("/api/connect", followRoute);

app.use(notFoundRoute);

app.use(errorHandlerDevMiddlewareDev);

export { app };
