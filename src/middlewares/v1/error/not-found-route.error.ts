import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../../classes/error";

export const notFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundError(`Route not found - ${req.originalUrl} `));
};
