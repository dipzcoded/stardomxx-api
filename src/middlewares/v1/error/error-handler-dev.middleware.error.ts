import { NextFunction, Response, Request } from "express";
import { CustomError } from "../../../classes/abstract/error";
import { ResponseStatusCodeEnum } from "../../../enums/v1";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors());
  }

  // console.error(err);
  res.status(ResponseStatusCodeEnum.BAD).json({
    status: "failed",
    errors: [
      {
        message: err.message,
      },
    ],
  });
};
