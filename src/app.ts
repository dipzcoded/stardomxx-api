import express, { NextFunction, Request, Response } from "express";
import {
  userRoute,
  profileRoute,
  followRoute,
  commentRoute,
  contestRoute,
  postRoute,
  userLikeRoute,
  voteRoute,
} from "./routes/v1";
import { routingBaseUrlEnum } from "./enums/v1";
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

app.use(routingBaseUrlEnum.USER_V1_BASEURL, userRoute);
app.use(routingBaseUrlEnum.PROFILE_V1_BASEURL, profileRoute);
app.use(routingBaseUrlEnum.FOLLOWING_V1_BASEURL, followRoute);
app.use(routingBaseUrlEnum.COMMENT_V1_BASEURL, commentRoute);
app.use(routingBaseUrlEnum.CONTEST_V1_BASEURL, contestRoute);
app.use(routingBaseUrlEnum.POST_V1_BASEURL, postRoute);
app.use(routingBaseUrlEnum.USERLIKES_V1_BASEURL, userLikeRoute);
app.use(routingBaseUrlEnum.VOTES_V1_BASEURL, voteRoute);

app.use(notFoundRoute);

app.use(errorHandlerDevMiddlewareDev);

export { app };
