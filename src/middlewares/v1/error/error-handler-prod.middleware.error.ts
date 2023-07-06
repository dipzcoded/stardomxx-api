import { NextFunction, Response, Request } from "express";
import { exceptionHandler } from "../../../classes/error";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  exceptionHandler.handleError(err, res);
};
